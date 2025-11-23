import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret";

export interface AuthRequest extends Request {
  user?: { id: string };
}

// ... (imports)

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(401).json({ success: false, error: "Token not provided" });
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    const userExists = await new Promise<boolean>((resolve) => {
      db.all("SELECT id FROM users WHERE id = ?", decoded.id, (err: Error | null, rows: any[]) => {
        resolve(!err && rows && rows.length > 0);
      });
    });

    if (!userExists) {
      return res.status(401).json({ success: false, error: "User not found or removed" });
    }

    req.user = { id: decoded.id };

    return next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(500).json({ success: false, error: "Authentication failed" });
  }
};

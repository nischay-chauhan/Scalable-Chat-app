import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db, { generateId } from "../db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret";

router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "username & password required" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const id = generateId();

    db.run(
      "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
      id, username, hashed,
      (err: Error | null) => {
        if (err) {
          return res.status(400).json({ success: false, error: "Username taken" });
        }
        const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
          success: true,
          user: { id, username },
          token
        });
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  db.all("SELECT * FROM users WHERE username = ?", username, async (err: Error | null, rows: any[]) => {
    const user = rows && rows.length > 0 ? rows[0] : null;
    if (err || !user) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ success: false, error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.json({
        success: true,
        user: { id: user.id, username: user.username },
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, error: "Login failed" });
    }
  });
});

export default router;

import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import db from "../db";

const router = Router();

// ✅ MUST apply authMiddleware
router.get("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  db.get(
    "SELECT id, username, created_at FROM users WHERE id = ?", 
    [req.user?.id], 
    (err: Error | null, user: any) => {
      if (err || !user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      res.json({ success: true, user });
    }
  );
});

router.put("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, error: "Username is required" });
  }

  db.run(
    "UPDATE users SET username = ? WHERE id = ?",
    [username, req.user?.id],
    function (this: { changes: number }, err: Error | null) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message.includes("UNIQUE") ? "Username already taken" : "Update failed"
        });
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      res.json({ success: true, user: { id: req.user?.id, username } });
    }
  );
});

export default router;

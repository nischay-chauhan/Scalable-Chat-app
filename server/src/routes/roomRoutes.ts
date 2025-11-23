import { Router, Response } from "express";
import db, { generateId } from "../db";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, (req: AuthRequest, res: Response) => {
  const { name, isPrivate, accessCode } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: "Room name is required" });
  }

  const roomId = generateId();
  const is_private = isPrivate || false;
  const access_code = isPrivate && accessCode ? accessCode : null;

  db.run(
    "INSERT INTO rooms (id, name, created_by, is_private, access_code) VALUES (?, ?, ?, ?, ?)",
    roomId, name, req.user?.id, is_private, access_code,
    (err: Error | null) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message.includes("UNIQUE") ? "Room name already exists" : "Failed to create room"
        });
      }

      db.run(
        "INSERT OR IGNORE INTO room_members (user_id, room_id) VALUES (?, ?)",
        req.user?.id, roomId,
        () => {
          res.status(201).json({
            success: true,
            room: { id: roomId, name, created_by: req.user?.id, is_private, access_code: access_code ? "***" : null }
          });
        }
      );
    }
  );
});

router.post("/:roomId/join", authMiddleware, (req: AuthRequest, res: Response) => {
  const { roomId } = req.params;
  const { accessCode } = req.body || {};

  db.all("SELECT id, is_private, access_code FROM rooms WHERE id = ?", roomId, (err: Error | null, rows: any[]) => {
    const room = rows && rows.length > 0 ? rows[0] : null;
    if (err || !room) {
      return res.status(404).json({ success: false, error: "Room not found" });
    }

    if (room.is_private === true || room.is_private === 1) {
      if (!accessCode || accessCode !== room.access_code) {
        return res.status(403).json({ success: false, error: "Invalid access code" });
      }
    }

    db.run(
      "INSERT OR IGNORE INTO room_members (user_id, room_id) VALUES (?, ?)",
      req.user?.id, roomId,
      (err: Error | null) => {
        if (err) {
          return res.status(500).json({ success: false, error: "Failed to join room" });
        }
        res.json({ success: true });
      }
    );
  });
});

router.get("/my-rooms", authMiddleware, (req: AuthRequest, res: Response) => {
  db.all(
    `SELECT r.* FROM rooms r 
     JOIN room_members rm ON r.id = rm.room_id 
     WHERE rm.user_id = ? 
     ORDER BY r.created_at DESC`,
    req.user?.id,
    (err: Error | null, rooms: any[]) => {
      if (err) {
        return res.status(500).json({ success: false, error: "Failed to fetch rooms" });
      }
      res.json({ success: true, rooms });
    }
  );
});

router.get("/:roomId", authMiddleware, (req: AuthRequest, res: Response) => {
  const { roomId } = req.params;

  db.serialize(() => {
    db.all(
      `SELECT r.*, u.username as created_by_username 
       FROM rooms r 
       JOIN users u ON r.created_by = u.id 
       WHERE r.id = ?`,
      roomId,
      (err: Error | null, rows: any[]) => {
        const room = rows && rows.length > 0 ? rows[0] : null;
        if (err || !room) {
          return res.status(404).json({ success: false, error: "Room not found" });
        }

        db.all(
          `SELECT u.id, u.username 
           FROM users u 
           JOIN room_members rm ON u.id = rm.user_id 
           WHERE rm.room_id = ?`,
          roomId,
          (err: Error | null, members: any[]) => {
            if (err) {
              return res.status(500).json({ success: false, error: "Failed to fetch room members" });
            }

            db.all(
              `SELECT m.*, u.username as author 
               FROM messages m 
               JOIN users u ON m.user_id = u.id 
               WHERE m.room_id = ? 
               ORDER BY m.timestamp ASC`,
              roomId,
              (err: Error | null, messages: any[]) => {
                if (err) {
                  return res.status(500).json({ success: false, error: "Failed to fetch messages" });
                }

                res.json({
                  success: true,
                  room: {
                    ...room,
                    members,
                    messages
                  }
                });
              }
            );
          }
        );
      }
    );
  });
});

router.post("/:roomId/messages", authMiddleware, (req: AuthRequest, res: Response) => {
  const { roomId } = req.params;
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ success: false, error: "Message text is required" });
  }

  db.all(
    "SELECT 1 FROM room_members WHERE user_id = ? AND room_id = ?",
    req.user?.id, roomId,
    (err: Error | null, rows: any[]) => {
      const member = rows && rows.length > 0 ? rows[0] : null;
      if (err || !member) {
        return res.status(403).json({ success: false, error: "Not a member of this room" });
      }

      const messageId = generateId();

      db.run(
        "INSERT INTO messages (id, user_id, room_id, text) VALUES (?, ?, ?, ?)",
        messageId, req.user?.id, roomId, text.trim(),
        (err: Error | null) => {
          if (err) {
            return res.status(500).json({ success: false, error: "Failed to send message" });
          }

          db.all(
            `SELECT m.*, u.username as author 
             FROM messages m 
             JOIN users u ON m.user_id = u.id 
             WHERE m.id = ?`,
            messageId,
            (err: Error | null, rows: any[]) => {
              const message = rows && rows.length > 0 ? rows[0] : null;
              if (err || !message) {
                return res.json({ success: true, messageId });
              }
              res.status(201).json({ success: true, message });
            }
          );
        }
      );
    }
  );
});

export default router;

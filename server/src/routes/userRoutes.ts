import { Router, Request, Response } from "express";
import { addUser, removeUser, getUserByUsername, getUsersInRoom } from "../socket/user";

const router = Router();

router.post("/users", async (req: Request, res: Response) => {
  const { username, room } = req.body || {};
  if (!username || !room) {
    return res.status(400).json({ success: false, error: "'username' and 'room' are required" });
  }
  const result = await addUser(username, room);
  if (!result.success) {
    return res.status(500).json(result);
  }
  return res.status(201).json(result);
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, error: "'id' is required" });
  }
  const result = await removeUser(id);
  if (!result.success) {
    return res.status(500).json(result);
  }
  return res.status(200).json(result);
});

router.get("/users", async (req: Request, res: Response) => {
  const { room } = req.query as { room?: string };
  if (!room) {
    return res.status(400).json({ success: false, error: "Query param 'room' is required" });
  }
  const result = await getUsersInRoom(room);
  if (!result.success) {
    return res.status(500).json(result);
  }
  return res.status(200).json(result);
});

router.get("/users/by-username/:username", async (req: Request, res: Response) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({ success: false, error: "'username' is required" });
  }
  const result = await getUserByUsername(username);
  if (!result.success) {
    return res.status(500).json(result);
  }
  return res.status(200).json(result);
});

export default router;

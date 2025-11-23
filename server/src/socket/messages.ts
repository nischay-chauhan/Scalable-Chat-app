import db, { generateId } from "../db";
import { ChatMessage } from "./type";
import { getUserByUsername } from "./user";


export const addMessage = async (msg: ChatMessage) => {
    const id = generateId();
    try {
        const { success, user, error: userError } = await getUserByUsername(msg.username);
        if (!success || !user) {
            throw new Error(userError || `User not found for username: ${msg.username}`);
        }
        await new Promise<void>((resolve, reject) => {
            db.run(
                "INSERT INTO messages (id , user_id , room_id , text) VALUES (?, ?, ?, ?)",
                id, user.id, msg.room_id, msg.text,
                (error) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve()
                    }
                }
            )
        })
        return { success: true, message: "Message added successfully", id }
    } catch (error: any) {
        return { success: false, error: error.toString() }
    }
}

export const addReceipt = async (messageId: string, userId: string, status: 'delivered' | 'read') => {
    const id = generateId();
    try {
        await new Promise<void>((resolve, reject) => {
            db.run(
                `INSERT INTO message_receipts (id, message_id, user_id, status) 
                 VALUES (?, ?, ?, ?) 
                 ON CONFLICT (message_id, user_id) DO UPDATE SET status = ?, timestamp = now()`,
                id, messageId, userId, status, status,
                (error) => {
                    if (error) reject(error);
                    else resolve();
                }
            );
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.toString() };
    }
};

export const getUnreadMessages = async (userId: string, roomId: string) => {
    try {
        const messages = await new Promise<any[]>((resolve, reject) => {
            db.all(
                `SELECT m.* FROM messages m
                 LEFT JOIN message_receipts mr ON m.id = mr.message_id AND mr.user_id = ?
                 WHERE m.room_id = ? AND m.user_id != ? AND (mr.status IS NULL OR mr.status != 'read')`,
                userId, roomId, userId,
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
        return { success: true, messages };
    } catch (error: any) {
        return { success: false, error: error.toString() };
    }
};
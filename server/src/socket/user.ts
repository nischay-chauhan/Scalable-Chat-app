import db from "../db";
import { User } from "./type";

export const getUserByUsername = async (username: string) => {
    return new Promise<any>((resolve, reject) => {
        db.all(
            "SELECT * FROM users WHERE username = ?",
            [username],
            (error, rows) => {
                if (error) return reject(error);
                if (!rows || rows.length === 0) {
                    return resolve({ success: false, error: "User not found" });
                }
                const user = rows[0];
                resolve({ success: true, user });
            }
        );
    });
};

export const addMemberToRoom = async (username: string, roomId: string) => {
    try {
        const { success, user, error } = await getUserByUsername(username);
        if (!success || !user) throw new Error(error || "User not found");

        await new Promise((resolve, reject) => {
            db.run(
                "INSERT OR IGNORE INTO room_members (user_id, room_id) VALUES (?, ?)",
                user.id, roomId,
                (error) => {
                    if (error) reject(error);
                    else resolve(true);
                }
            );
        });
        return { success: true, user: { id: user.id, username, room_id: roomId } };

    } catch (error: any) {
        return { success: false, error: error.toString() };
    }
}


export const removeMemberFromRoom = async (username: string, roomId: string) => {
    try {
        const { success, user, error } = await getUserByUsername(username);
        if (!success || !user) throw new Error(error || "User not found");

        await new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM room_members WHERE user_id = ? AND room_id = ?",
                user.id, roomId,
                (error) => {
                    if (error) reject(error);
                    else resolve(true);
                }
            );
        });
        return { success: true, message: "User removed from room successfully" }

    } catch (error: any) {
        return { success: false, error: error.toString() };
    }
}

export const getUsersInRoom = async (roomId: string) => {
    try {
        const users = await new Promise<any>((resolve, reject) => {
            db.all(
                `SELECT u.id, u.username, rm.room_id 
                 FROM users u 
                 JOIN room_members rm ON u.id = rm.user_id 
                 WHERE rm.room_id = ?` ,
                [roomId],
                (error, rows) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
        return { success: true, users }

    } catch (error: any) {
        return { success: false, error: error.toString() }
    }
}

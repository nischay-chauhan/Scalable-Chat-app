import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const pub = new Redis(REDIS_URL);
export const sub = new Redis(REDIS_URL);

pub.on("error", (err) => console.error("Redis Pub Error:", err));
sub.on("error", (err) => console.error("Redis Sub Error:", err));

export const subscribeToRoom = (roomId: string) => {
    sub.subscribe(`room:${roomId}`, (err) => {
        if (err) console.error("Failed to subscribe to room:", roomId, err);
        else console.log("Subscribed to room channel:", roomId);
    });
};

export const publishMessage = (roomId: string, message: any) => {
    pub.publish(`room:${roomId}`, JSON.stringify(message));
};

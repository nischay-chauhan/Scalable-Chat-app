import { addMessage, addReceipt, getUnreadMessages } from '../../socket/messages';
import { addMemberToRoom } from '../../socket/user';
import db, { generateId } from '../../db';

describe('Socket Messages', () => {
    let testUserId: string;
    let testUsername: string;
    let testRoomId: string;

    beforeEach(async () => {
        testUserId = generateId();
        testUsername = `test_user_${Date.now()}`;
        testRoomId = generateId();

        await new Promise<void>((resolve, reject) => {
            db.run(
                "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
                testUserId, testUsername, "password",
                (err) => err ? reject(err) : resolve()
            );
        });

        await new Promise<void>((resolve, reject) => {
            db.run(
                "INSERT INTO rooms (id, name, created_by) VALUES (?, ?, ?)",
                testRoomId, `test_room_${Date.now()}`, testUserId,
                (err) => err ? reject(err) : resolve()
            );
        });

        await addMemberToRoom(testUsername, testRoomId);
    });

    describe('addMessage', () => {
        it('should add a message successfully', async () => {
            const result = await addMessage({
                username: testUsername,
                room_id: testRoomId,
                text: 'Test message'
            });

            expect(result.success).toBe(true);
            expect(result.id).toBeDefined();
        });

        it('should fail with invalid username', async () => {
            const result = await addMessage({
                username: 'nonexistent_user',
                room_id: testRoomId,
                text: 'Test message'
            });

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('addReceipt', () => {
        let messageId: string;

        beforeEach(async () => {
            const result = await addMessage({
                username: testUsername,
                room_id: testRoomId,
                text: 'Test message'
            });
            messageId = result.id!;
        });

        it('should add a delivered receipt', async () => {
            const result = await addReceipt(messageId, testUserId, 'delivered');
            expect(result.success).toBe(true);
        });

        it('should add a read receipt', async () => {
            const result = await addReceipt(messageId, testUserId, 'read');
            expect(result.success).toBe(true);
        });

        it('should update existing receipt', async () => {
            await addReceipt(messageId, testUserId, 'delivered');
            const result = await addReceipt(messageId, testUserId, 'read');
            expect(result.success).toBe(true);

            const receipts = await new Promise<any[]>((resolve, reject) => {
                db.all(
                    "SELECT * FROM message_receipts WHERE message_id = ? AND user_id = ?",
                    messageId, testUserId,
                    (err, rows) => err ? reject(err) : resolve(rows)
                );
            });
            expect(receipts.length).toBe(1);
            expect(receipts[0].status).toBe('read');
        });
    });

    describe('getUnreadMessages', () => {
        let senderId: string;
        let senderUsername: string;

        beforeEach(async () => {
            senderId = generateId();
            senderUsername = `sender_${Date.now()}`;

            await new Promise<void>((resolve, reject) => {
                db.run(
                    "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
                    senderId, senderUsername, "password",
                    (err) => err ? reject(err) : resolve()
                );
            });

            await addMemberToRoom(senderUsername, testRoomId);
        });

        it('should return unread messages', async () => {
            await addMessage({
                username: senderUsername,
                room_id: testRoomId,
                text: 'Unread message'
            });

            const result = await getUnreadMessages(testUserId, testRoomId);
            expect(result.success).toBe(true);
            expect(result.messages).toBeDefined();
            expect(result.messages!.length).toBeGreaterThan(0);
        });

        it('should not return read messages', async () => {
            const msgResult = await addMessage({
                username: senderUsername,
                room_id: testRoomId,
                text: 'Read message'
            });

            await addReceipt(msgResult.id!, testUserId, 'read');

            const result = await getUnreadMessages(testUserId, testRoomId);
            expect(result.success).toBe(true);
            expect(result.messages!.length).toBe(0);
        });
    });
});

import { addMemberToRoom, removeMemberFromRoom, getUsersInRoom, getUserByUsername } from '../../socket/user';
import db, { generateId } from '../../db';

describe('Socket User Functions', () => {
    let testUserId: string;
    let testUsername: string;
    let testRoomId: string;

    beforeEach(async () => {
        testUserId = generateId();
        testUsername = `test_user_${Date.now()}`;
        testRoomId = generateId();

        // Create test user
        await new Promise<void>((resolve, reject) => {
            db.run(
                "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
                testUserId, testUsername, "password",
                (err) => err ? reject(err) : resolve()
            );
        });

        // Create test room
        await new Promise<void>((resolve, reject) => {
            db.run(
                "INSERT INTO rooms (id, name, created_by) VALUES (?, ?, ?)",
                testRoomId, `test_room_${Date.now()}`, testUserId,
                (err) => err ? reject(err) : resolve()
            );
        });
    });

    describe('getUserByUsername', () => {
        it('should find existing user', async () => {
            const result = await getUserByUsername(testUsername);
            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
            expect(result.user?.username).toBe(testUsername);
        });

        it('should fail for non-existent user', async () => {
            const result = await getUserByUsername('nonexistent_user');
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('addMemberToRoom', () => {
        it('should add user to room successfully', async () => {
            const result = await addMemberToRoom(testUsername, testRoomId);
            expect(result.success).toBe(true);
        });

        it('should be idempotent (adding same user twice)', async () => {
            await addMemberToRoom(testUsername, testRoomId);
            const result = await addMemberToRoom(testUsername, testRoomId);
            expect(result.success).toBe(true);
        });

        it('should fail with invalid username', async () => {
            const result = await addMemberToRoom('nonexistent_user', testRoomId);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('removeMemberFromRoom', () => {
        beforeEach(async () => {
            await addMemberToRoom(testUsername, testRoomId);
        });

        it('should remove user from room successfully', async () => {
            const result = await removeMemberFromRoom(testUsername, testRoomId);
            expect(result.success).toBe(true);
        });

        it('should fail with invalid username', async () => {
            const result = await removeMemberFromRoom('nonexistent_user', testRoomId);
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('getUsersInRoom', () => {
        it('should return users in room', async () => {
            await addMemberToRoom(testUsername, testRoomId);

            const result = await getUsersInRoom(testRoomId);
            expect(result.success).toBe(true);
            expect(result.users).toBeDefined();
            expect(result.users!.length).toBeGreaterThan(0);
            expect(result.users![0].username).toBe(testUsername);
        });

        it('should return empty array for room with no members', async () => {
            const emptyRoomId = generateId();
            await new Promise<void>((resolve, reject) => {
                db.run(
                    "INSERT INTO rooms (id, name, created_by) VALUES (?, ?, ?)",
                    emptyRoomId, `empty_room_${Date.now()}`, testUserId,
                    (err) => err ? reject(err) : resolve()
                );
            });

            const result = await getUsersInRoom(emptyRoomId);
            expect(result.success).toBe(true);
            expect(result.users!.length).toBe(0);
        });
    });
});

import express from 'express';
import request from 'supertest';
import authRoutes from '../../routes/authRoutes';
import roomRoutes from '../../routes/roomRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

describe('Room Routes', () => {
    let authToken: string;
    let userId: string;
    const testUsername = `room_test_${Date.now()}`;
    const testPassword = 'password123';

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: testUsername, password: testPassword });

        authToken = res.body.token;
        userId = res.body.user.id;
    });

    describe('POST /api/rooms', () => {
        it('should create a room successfully', async () => {
            const res = await request(app)
                .post('/api/rooms')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: `test_room_${Date.now()}` });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.room).toBeDefined();
            expect(res.body.room.id).toBeDefined();
        });

        it('should create a private room with access code', async () => {
            const res = await request(app)
                .post('/api/rooms')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: `private_room_${Date.now()}`,
                    isPrivate: true,
                    accessCode: 'secret123'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.room.is_private).toBeTruthy();
            expect(res.body.room.access_code).toBe('***');
        });

        it('should fail without authentication', async () => {
            const res = await request(app)
                .post('/api/rooms')
                .send({ name: `test_room_${Date.now()}` });

            expect(res.status).toBe(401);
        });

        it('should fail with missing room name', async () => {
            const res = await request(app)
                .post('/api/rooms')
                .set('Authorization', `Bearer ${authToken}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/rooms/:roomId/join', () => {
        let publicRoomId: string;
        let privateRoomId: string;
        const accessCode = 'secret123';

        beforeAll(async () => {
            // Create public room
            const publicRes = await request(app)
                .post('/api/rooms')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: `public_${Date.now()}` });
            publicRoomId = publicRes.body.room.id;

            // Create private room
            const privateRes = await request(app)
                .post('/api/rooms')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: `private_${Date.now()}`,
                    isPrivate: true,
                    accessCode
                });
            privateRoomId = privateRes.body.room.id;
        });

        it('should join public room successfully', async () => {
            const res = await request(app)
                .post(`/api/rooms/${publicRoomId}/join`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should fail to join private room without access code', async () => {
            const res = await request(app)
                .post(`/api/rooms/${privateRoomId}/join`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it('should fail to join private room with wrong access code', async () => {
            const res = await request(app)
                .post(`/api/rooms/${privateRoomId}/join`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ accessCode: 'wrongcode' });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });

        it('should join private room with correct access code', async () => {
            const res = await request(app)
                .post(`/api/rooms/${privateRoomId}/join`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ accessCode });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should fail without authentication', async () => {
            const res = await request(app)
                .post(`/api/rooms/${publicRoomId}/join`);

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/rooms/my-rooms', () => {
        it('should return user rooms', async () => {
            const res = await request(app)
                .get('/api/rooms/my-rooms')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.rooms).toBeDefined();
            expect(Array.isArray(res.body.rooms)).toBe(true);
        });

        it('should fail without authentication', async () => {
            const res = await request(app)
                .get('/api/rooms/my-rooms');

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/rooms/:roomId', () => {
        let roomId: string;

        beforeAll(async () => {
            const res = await request(app)
                .post('/api/rooms')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: `detail_room_${Date.now()}` });
            roomId = res.body.room.id;
        });

        it('should return room details', async () => {
            const res = await request(app)
                .get(`/api/rooms/${roomId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.room).toBeDefined();
            expect(res.body.room.id).toBe(roomId);
        });

        it('should fail for non-existent room', async () => {
            const res = await request(app)
                .get('/api/rooms/nonexistent-id')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
        });
    });
});

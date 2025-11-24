import express from 'express';
import request from 'supertest';
import authRoutes from '../../routes/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
    const testUsername = `test_${Date.now()}`;
    const testPassword = 'password123';

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: testUsername, password: testPassword });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.user).toBeDefined();
            expect(res.body.user.username).toBe(testUsername);
        });

        it('should fail with missing username', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ password: testPassword });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should fail with missing password', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: `test2_${Date.now()}` });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should fail with duplicate username', async () => {
            const duplicateUsername = `duplicate_${Date.now()}`;

            await request(app)
                .post('/api/auth/register')
                .send({ username: duplicateUsername, password: testPassword });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: duplicateUsername, password: testPassword });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        const loginUsername = `login_${Date.now()}`;

        beforeAll(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({ username: loginUsername, password: testPassword });
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: loginUsername, password: testPassword });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.user).toBeDefined();
        });

        it('should fail with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: loginUsername, password: 'wrongpassword' });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should fail with non-existent username', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'nonexistent_user', password: testPassword });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should fail with missing credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});

import express, { Request, Response } from 'express';
import request from 'supertest';
import { authMiddleware } from '../../middleware/auth';
import authRoutes from '../../routes/authRoutes';
import jwt from 'jsonwebtoken';
import { generateId } from '../../db';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test route that uses authMiddleware
app.get('/api/protected', authMiddleware, (req: Request, res: Response) => {
    res.json({ success: true, message: 'Protected route accessed' });
});

describe('Auth Middleware', () => {
    let validToken: string;
    let userId: string;

    beforeAll(async () => {
        // Register a user to get a valid token
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: `middleware_test_${Date.now()}`, password: 'password123' });

        validToken = res.body.token;
        userId = res.body.user.id;
    });

    describe('Valid Authentication', () => {
        it('should allow access with valid token', async () => {
            const res = await request(app)
                .get('/api/protected')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Invalid Authentication', () => {
        it('should reject request without Authorization header', async () => {
            const res = await request(app)
                .get('/api/protected');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should reject request with malformed Authorization header', async () => {
            const res = await request(app)
                .get('/api/protected')
                .set('Authorization', 'InvalidFormat');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should reject request with invalid token', async () => {
            const res = await request(app)
                .get('/api/protected')
                .set('Authorization', 'Bearer invalid_token');

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should reject request with expired token', async () => {
            const expiredToken = jwt.sign(
                { id: userId },
                JWT_SECRET,
                { expiresIn: '-1h' } // Expired 1 hour ago
            );

            const res = await request(app)
                .get('/api/protected')
                .set('Authorization', `Bearer ${expiredToken}`);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should reject request with token for non-existent user', async () => {
            const fakeUserId = generateId();
            const fakeToken = jwt.sign({ id: fakeUserId }, JWT_SECRET);

            const res = await request(app)
                .get('/api/protected')
                .set('Authorization', `Bearer ${fakeToken}`);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});

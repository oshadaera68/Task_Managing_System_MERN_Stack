const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const SignUp = require('../model/signup.model');

describe('POST /signin', () => {
    beforeAll(async () => {
        // Connect to DB if not connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        // Remove existing test user if any
        await SignUp.deleteOne({ email: 'testuser@example.com' });

        // Create new user (password will be hashed automatically)
        const user = new SignUp({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
            role: 'user',
        });
        await user.save();
    });

    afterAll(async () => {
        // Cleanup test user and disconnect DB
        await SignUp.deleteOne({ email: 'testuser@example.com' });
        await mongoose.connection.close();
    });

    test('should return 200 and token on successful login', async () => {
        const res = await request(app)
            .post('/signin')
            .send({ email: 'testuser@example.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Login successful');
        expect(res.body.token).toBeDefined();
        expect(typeof res.body.token).toBe('string');
    });
});

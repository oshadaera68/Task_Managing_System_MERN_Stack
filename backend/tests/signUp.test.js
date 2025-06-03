/**
 *Coded By: Era Boy
 *Version: v0.1.0
 **/

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Your express app
const SignUp = require('../model/signup.model');

describe('POST /signup', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
    });

    afterAll(async () => {
        // Clean up all test users created
        await SignUp.deleteMany({ email: /@example\.com$/ });
        await mongoose.connection.close();
    });

    test('should create a new user and return 201', async () => {
        const res = await request(app)
            .post('/signup')
            .send({
                name: 'Test User',
                email: 'newuser@example.com',
                password: 'password123',
                role: 'user',
            });

        expect(res.statusCode).toBe(201);
        expect(res.text).toBe('Signup successful');

        // Verify user saved in DB
        const user = await SignUp.findOne({ email: 'newuser@example.com' });
        expect(user).not.toBeNull();
        expect(user.name).toBe('Test User');
    });

    test('should not allow duplicate email and return 400', async () => {
        // Create user first
        await SignUp.create({
            name: 'Existing User',
            email: 'existing@example.com',
            password: 'password123',
            role: 'user',
        });

        // Attempt to sign up again with same email
        const res = await request(app)
            .post('/signup')
            .send({
                name: 'Another User',
                email: 'existing@example.com',
                password: 'password123',
                role: 'user',
            });

        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('User already exists');
    });
});

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // <- now this works
const Task = require('../model/task.model');
const User = require('../model/signup.model');
const jwt = require('jsonwebtoken');

let testToken;
let testUserId;
let testTaskId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test1234',
    });

    await testUser.save();
    testUserId = testUser._id;

    testToken = jwt.sign(
        { id: testUserId, role: 'user' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
    );

    const task = new Task({
        title: 'Initial Task',
        description: 'Sample task for testing',
        createdBy: testUserId,
    });

    const savedTask = await task.save();
    testTaskId = savedTask._id;
});

afterAll(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('🔒 /task routes using local MongoDB', () => {

    test('POST /task - should create a task', async () => {
        const res = await request(app)
            .post('/task')
            .set('Authorization', `Bearer ${testToken}`)
            .send({
                title: 'Test Task',
                description: 'Test description',
                priority: 'High',
                status: 'Pending',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.task).toHaveProperty('_id');
    });

    test('GET /task - should return user\'s tasks', async () => {
        const res = await request(app)
            .get('/task')
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('PUT /task/:id - should update user\'s task', async () => {
        const res = await request(app)
            .put(`/task/${testTaskId}`)
            .set('Authorization', `Bearer ${testToken}`)
            .send({ title: 'Updated Task', description: 'Updated description' });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated Task');
    });

    test('DELETE /task/:id - should delete user\'s task', async () => {
        const res = await request(app)
            .delete(`/task/${testTaskId}`)
            .set('Authorization', `Bearer ${testToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
});

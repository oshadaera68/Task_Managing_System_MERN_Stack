const { Router } = require("express");
const router = Router();
const SignUp = require('../model/signup.model');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: Signup successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Signup successful
 *       400:
 *         description: User already exists
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await SignUp.findOne({ email });
        if (userExists) {
            return res.status(400).send('User already exists');
        }

        const newUser = new SignUp({ name, email, password, role });
        await newUser.save();

        res.status(201).send('Signup successful');
    } catch (error) {
        next(error);
    }
});

module.exports = router;

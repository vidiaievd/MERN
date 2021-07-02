const { Router } = require('express');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email','email is wrong').isEmail(),
        check('password', 'min length 6 char').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message:'incorrect registration data'
                })
            }

            const { email, password } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: 'User with this email is already registered' })
            };

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({ email, password: hashedPassword });

            await user.save();

            res.status(201).json({ message: 'User created' })

        } catch (e) {
            res.status(500).json({message: 'something went wrong... with cath from auth.routes'})
        }
    }
);

// /api/auth/login
router.post('/login',
    [
        check('email', 'input correctly email').normalizeEmail().isEmail(),
        check('password', 'input password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message:'incorrect login data'
                })
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if(!user) {
                return res.status(400).json({ message: 'User not found' })
            };

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(500).json({ message: 'incorrect password' })
            };

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            res.json({ token, userId: user.id})

        } catch (e) {
            res.status(500).json({message: 'something went wrong...'})
        }
    }
);

module.exports = router;
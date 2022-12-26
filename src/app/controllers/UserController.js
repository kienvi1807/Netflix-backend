require('dotenv').config();
const User = require('../../resources/models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const UserController = {
    // [POST] /api/auth/register
    // @desc Register new user
    register: async function (req, res) {
        const { username, email, password } = req.body;

        // Missing username or password
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Missing username or password' });
        }

        try {
            const user = await User.findOne({ username });

            // Username already taken
            if (user) {
                return res.status(400).json({ success: false, message: 'Username already taken' });
            }

            // All good
            const hashPassword = await argon2.hash(password);

            const newUser = await new User({
                username,
                email,
                password: hashPassword,
                isAdmin: username.startsWith(process.env.DB_USERNAME) ? true : false,
            });

            await newUser.save();

            if (newUser) {
                const { password, ...info } = newUser._doc;
                // Access token
                const accessToken = jwt.sign(
                    { userId: newUser._id, isAdmin: newUser.isAdmin },
                    process.env.ACCESS_TOKEN_SECRET,
                );

                return res
                    .status(201)
                    .json({ success: true, message: 'User register success', accessToken, user: info });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // [POST] /api/auth/login
    // @desc Login user
    login: async function (req, res) {
        const { username, password } = req.body;

        // Missing username or password or
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Missing username or password' });
        }

        try {
            const user = await User.findOne({ username });

            // Username not exist
            if (!user) {
                return res.status(400).json({ success: false, message: 'Wrong username or password' });
            }

            const validPassword = await argon2.verify(user.password, req.body.password);

            // Wrong password
            if (!validPassword) {
                return res.status(400).json({ success: false, message: 'Wrong username or password' });
            }

            // All good
            const accessToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET);

            const { password, ...info } = user._doc;

            return res.json({ success: true, message: 'Login success', accessToken, user: info });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // [GET] /api/users/
    // @desc Get all users
    getAll: async function (req, res) {
        // if (req.user.isAdmin) {
            try {
                const users = await User.find({});
                return res.json({ success: true, message: 'All users', users });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        // } else {
        //     return res.status(403).json({ success: false, message: 'You are not allowed to see all users' });
        // }
    },
};

module.exports = UserController;

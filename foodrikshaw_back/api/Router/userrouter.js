import { Router } from 'express';
import User from '../Model/User.model.js';

import jwt from 'jsonwebtoken';

const Userrouter = Router();

const auth = async (req, res, next) => {
    console.log(1);
    if (!req.cookies.jwt) {
        console.log('no token');
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select([
            '-password',
            '-__v',
            '-_id',
        ]);

        if (!user) {
            console.log(2);
            return res.status(401).send('Unauthorized: Invalid token');
        } else {
            console.log(3);
            req.user = user;
            console.log(req.user);
            next();
        }
    } catch (error) {
        console.log('Token verification failed:', error);
        return res.status(401).send('Unauthorized: Token verification failed');
    }
};

const genrateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

Userrouter.get('/', (req, res) => {
    res.send('User Router');
});

Userrouter.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        const token = genrateToken(user._id);

        res.cookie('jwt', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.header('Access-Control-Allow-Credentials', 'true');

        res.status(200).json(user.name);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error in creating user');
    }
});

Userrouter.get('/all', auth, async (req, res) => {
    const alluser = await User.find();
    res.send(alluser);
});
Userrouter.get('/profile', auth, async (req, res) => {
    const user = req.user;

    res.status(200).json(user);
});
Userrouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select(['-__v', '-_id']);
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }
        const token = genrateToken(user._id);
        res.cookie('jwt', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.header('Access-Control-Allow-Credentials', 'true');
        res.status(200).send('Logged in');
    } catch (error) {
        console.log(error);
        res.status(400).send('Error in logging in');
    }
});
Userrouter.get('/profile/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).send('Not logged in');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id !== email) {
            return res.status(401).send('Not logged in');
        }
        const user = await User.findOne({ email }).select([
            '-password',
            '-__v',
            '-_id',
            '-email',
        ]);

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error in fetching');
    }
});

export default Userrouter;

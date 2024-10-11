import { Router } from 'express';
import User from '../Model/User.model.js';
import Product from '../Model/Product.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const Userrouter = Router();

export const auth = async (req, res, next) => {
    if (!req.cookies.jwt) {
        console.log('no token');
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select([
            '-password',
            '-__v',
        ]);

        if (!user) {
            return res.status(401).send('Unauthorized: Invalid token');
        } else {
            req.user = user;

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
            maxAge: 24 * 60 * 60 * 1000 * 5,
        });
        res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
        res.header('Access-Control-Allow-Credentials', 'true');

        return res.status(200).json(user.name);
    } catch (error) {
        console.log(error);
        return res.status(400).send('Error in creating user');
    }
});

Userrouter.get('/all', auth, async (req, res) => {
    const alluser = await User.find();
    res.send(alluser);
});
Userrouter.get('/profile', auth, async (req, res) => {
    const user = req.user;
    const admin = process.env.ADMIN;

    if (user.email === admin) {
        res.status(200).json([user, { admin: true }]);
    } else {
        res.status(200).json([user, { admin: false }]);
    }
});
Userrouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select(['-__v']);

        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }
        const token = genrateToken(user._id);

        res.cookie('jwt', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
        res.header('Access-Control-Allow-Credentials', 'true');

        res.status(200).json(user.name);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error in logging in');
    }
});

Userrouter.get('/cart', auth, async (req, res) => {
    const user = req.user;

    try {
        const data = await User.findById(user._id);
        const real_data = data.cart;
        res.status(200).json(real_data);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error in fetching cart');
    }
});

Userrouter.post('/cart', auth, async (req, res) => {
    const user = req.user;
    const products = req.body;

    try {
        await User.findByIdAndUpdate(user._id, {
            $set: { cart: products },
        });
        res.status(200).send('Added to cart');
    } catch (error) {
        console.log(error);
        res.status(400).send('Error in adding to cart');
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

import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { purchaseCache, orderCache } from './cache.js';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        const purchaseCollection = mongoose.connection.collection('purchases');
        const changeStream = purchaseCollection.watch();

        changeStream.on('change', (change) => {
            console.log('Change detected:', change);

            purchaseCache.flushAll();
            orderCache.flushAll();
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const dbConnectionMiddleware = async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        try {
            await connectDB();
        } catch (error) {
            console.error('MongoDB connection error:', error);
            return res
                .status(500)
                .json({ message: 'Database connection error' });
        }
    }
    next();
};

export { connectDB, dbConnectionMiddleware };

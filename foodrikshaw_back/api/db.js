import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log('MongoDB connected');
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

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
    }
}
connect();
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('connected', () => {
    console.log('Connected to MongoDB');
});

export default db;

const dbConnectionMiddleware = async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB connected');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            return res
                .status(500)
                .json({ message: 'Database connection error' });
        }
    }
    next();
};

export { dbConnectionMiddleware };

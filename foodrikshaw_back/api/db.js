import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL_PRO, {});
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

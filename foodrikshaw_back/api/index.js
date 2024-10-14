import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Userrouter from './Router/userrouter.js';
import { productrouter } from './Router/productroter.js';
import { purchaserouter } from './Router/purchaserouter.js';
import { orderCache, purchaseCache } from './cache.js';
import { connectDB } from './db.js';
const app = express();

app.use(
    cors({
        origin: 'https://food.rajb.codes',
        credentials: true,
        exposedHeaders: ['ETag', 'Last-Modified'],
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/user', Userrouter);
app.use('/product', productrouter);
app.use('/purchase', purchaserouter);

app.get('/', (req, res) => {
    res.send('Hello World' + Date.now());
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
connectDB();

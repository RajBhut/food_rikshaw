import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Userrouter from './Router/userrouter.js';
import { productrouter } from './Router/productroter.js';
import { purchaserouter } from './Router/purchaserouter.js';

const app = express();
//test
app.use(
    cors({
        origin: 'https://food.rajb.codes/',
        credentials: true,
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

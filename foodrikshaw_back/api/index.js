import exprees from 'express';
import db from './db.js';
import cors from 'cors';

import Userrouter from './Router/userrouter.js';
import cookieParser from 'cookie-parser';
const app = exprees();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(exprees.json());

app.use(cookieParser());

app.use('/user', Userrouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    res.send('Hello World' + Date.now());
});

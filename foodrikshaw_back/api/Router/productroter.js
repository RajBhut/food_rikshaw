import Product from '../Model/Product.model.js';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

export const productrouter = Router();

productrouter.get('/', async (req, res) => {
    try {
        const products = await Product.find().select([
            '-__v',
            '-createdAt',
            '-updatedAt',
        ]);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

productrouter.post('/', async (req, res) => {
    const {
        name,
        everyday,
        price,
        description,
        img_url,
        time,
        day,
        available,
    } = req.body;
    try {
        const product = await Product.create({
            name,
            price,
            description,
            img_url,
            time,
            everyday,
            day,
            available,
        });
        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error in creating product');
    }
});

productrouter.get('/product/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});
productrouter.get('/products', async (req, res) => {
    const { id, day, available, category, priceMin, priceMax } = req.query;
    let filter = {};

    if (id) filter._id = id;
    if (day) filter.day = day;
    if (available) filter.available = available === 'true';

    if (priceMin) filter.price = { ...filter.price, $gte: Number(priceMin) };
    if (priceMax) filter.price = { ...filter.price, $lte: Number(priceMax) };

    try {
        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

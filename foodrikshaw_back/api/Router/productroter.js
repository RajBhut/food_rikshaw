import Product from '../Model/Product.model.js';
import { Router } from 'express';

import db, { dbConnectionMiddleware } from '../db.js';
import crypto from 'crypto';
export const productrouter = Router();

function generateETag(data) {
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

productrouter.get('/', dbConnectionMiddleware, async (req, res) => {
    try {
        const products = await Product.find().select(['-__v', '-createdAt']);

        // const eTag = generateETag(products);
        // const lastModified = products.length
        //     ? products[0].updatedAt
        //     : new Date();

        res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
        res.header('Access-Control-Allow-Credentials', 'true');
        // res.header('Access-Control-Expose-Headers', 'ETag, Last-Modified');

        // if (req.headers['if-none-match'] === eTag) {
        //     return res.status(304).send();
        // }

        // if (
        //     req.headers['if-modified-since'] &&
        //     new Date(req.headers['if-modified-since']) >= new Date(lastModified)
        // ) {
        //     return res.status(304).send();
        // }
        // res.setHeader('ETag', eTag);

        // res.setHeader('Last-Modified', lastModified.toUTCString());

        // Send product data
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

productrouter.post('/', dbConnectionMiddleware, async (req, res) => {
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
        res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(400).send('Error in creating product');
    }
});

productrouter.get('/product/:id', dbConnectionMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});
productrouter.get('/products', dbConnectionMiddleware, async (req, res) => {
    const { id, day, available, category, priceMin, priceMax } = req.query;
    let filter = {};

    if (id) filter._id = id;
    if (day) filter.day = day;
    if (available) filter.available = available === 'true';

    if (priceMin) filter.price = { ...filter.price, $gte: Number(priceMin) };
    if (priceMax) filter.price = { ...filter.price, $lte: Number(priceMax) };

    try {
        const products = await Product.find(filter);
        res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

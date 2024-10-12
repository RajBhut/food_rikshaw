import { Router } from 'express';
import { auth } from './userrouter.js';
import { Purchase } from '../Model/Purchase.model.js';
import User from '../Model/User.model.js';
import Product from '../Model/Product.model.js';
import { dbConnectionMiddleware } from '../db.js';
const purchaserouter = Router();

purchaserouter.get('/', dbConnectionMiddleware, auth, async (req, res) => {
    const user = req.user;
    const Purchase = await Purchase.findmany({ user_id: user._id });
    res.json(Purchase);
});
purchaserouter.get('/all', dbConnectionMiddleware, auth, async (req, res) => {
    const raw = await Purchase.find();

    const purchases = [];

    for (const purchase of raw) {
        console.log(purchase);
        let user = await User.findById(purchase.user_id);

        let pro = [];

        for (const items of purchase.products) {
            let product = await Product.findById(items.product_id);

            let name = product.name;
            let quantity = items.quantity;
            let price = product.price;
            pro.push({ name, quantity, price });
        }

        purchases.push({ name: user.name, email: user.email, items: pro });
    }
    res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).json(purchases);
});

purchaserouter.get(
    '/purchase/today',
    dbConnectionMiddleware,
    async (req, res) => {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        try {
            const orders = await Purchase.find({
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            });
            res.header(
                'Access-Control-Allow-Origin',
                'https://food.rajb.codes',
            );
            res.header('Access-Control-Allow-Credentials', 'true');
            res.status(200).send(orders);
        } catch (error) {
            res.status(500).send({ error: "Error fetching today's orders" });
        }
    },
);

purchaserouter.get('/cart', dbConnectionMiddleware, auth, async (req, res) => {
    const user = req.user;
    const real_user = await User.findById(user._id);
    const cart = real_user.cart;
    const products = [];
    cart.forEach(async (item) => {
        const product = await Product.findById(item.product_id);
        products.push({ product, quantity: item.quantity });
    });
    res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.json(products);
});

purchaserouter.post('/buy', dbConnectionMiddleware, auth, async (req, res) => {
    const user = req.user;
    const real_user = await User.findById(user._id);

    const cart = real_user.cart;

    const products = [];
    let total = 0;
    try {
        for (const item of cart) {
            const product = await Product.findById(item.product_id);

            products.push({ product_id: product._id, quantity: item.quantity });

            total += item.price * item.quantity;
        }

        const purchase = await Purchase.create({
            user_id: user._id,
            products: products,
            total: total,
        });
        await User.findByIdAndUpdate(user._id, {
            $set: { cart: [] },
        });
        res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.status(200).json(purchase);
    } catch (error) {
        res.status(401).json('eror in placing order');
    }
});
purchaserouter.put(
    '/purchase/:id/ready',
    dbConnectionMiddleware,
    async (req, res) => {
        const { id } = req.params;
        try {
            const updatedOrder = await Purchase.findByIdAndUpdate(
                id,
                { isReady: true },
                { new: true },
            );
            res.header(
                'Access-Control-Allow-Origin',
                'https://food.rajb.codes',
            );
            res.header('Access-Control-Allow-Credentials', 'true');
            res.status(200).send(updatedOrder);
        } catch (error) {
            res.status(500).send({ error: 'Error updating order status' });
        }
    },
);

export { purchaserouter };

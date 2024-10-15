// import { Router } from 'express';
// import { auth } from './userrouter.js';
// import { Purchase } from '../Model/Purchase.model.js';
// import User from '../Model/User.model.js';
// import Product from '../Model/Product.model.js';
// import { dbConnectionMiddleware } from '../db.js';

// import { orderCache, purchaseCache } from '../cache.js';
// const purchaserouter = Router();

// purchaserouter.get('/', dbConnectionMiddleware, auth, async (req, res) => {
//     const user = req.user;
//     const Purchase = await Purchase.findmany({ user_id: user._id });
//     res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.json(Purchase);
// });
// purchaserouter.get('/all', dbConnectionMiddleware, auth, async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const cacheKey = `orders_page_${page}_limit_${limit}`;

//     const cachedData = orderCache.get(cacheKey);
//     if (cachedData) {
//         console.log('Cache hit');
//         return res.status(200).json(cachedData);
//     }

//     try {
//         const totalOrders = await Purchase.countDocuments();

//         const raw = await Purchase.find()
//             .skip((page - 1) * limit)
//             .limit(limit);

//         const purchases = [];

//         for (const purchase of raw) {
//             let user = await User.findById(purchase.user_id);
//             if (user == null) {
//                 continue;
//             }
//             let pro = [];

//             for (const items of purchase.products) {
//                 let product = await Product.findById(items.product_id);

//                 let name = product.name;
//                 let quantity = items.quantity;
//                 let price = product.price;
//                 pro.push({ name, quantity, price });
//             }

//             purchases.push({
//                 name: user.name,
//                 email: user.email,
//                 items: pro,
//                 date: purchase.createdAt,
//             });
//         }

//         const responseData = {
//             orders: purchases,
//             totalPages: Math.ceil(totalOrders / limit),
//             currentPage: page,
//         };

//         orderCache.set(cacheKey, responseData);

//         res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
//         res.header('Access-Control-Allow-Credentials', 'true');
//         res.status(200).json(responseData);
//     } catch (error) {
//         res.status(500).send({ error: 'Error fetching orders' });
//     }
// });

// purchaserouter.get(
//     '/username',
//     dbConnectionMiddleware,
//     auth,
//     async (req, res) => {
//         const us = req.user;
//         const cacheKey = `user_${us._id}_purchases`;

//         const cachedData = purchaseCache.get(cacheKey);
//         if (cachedData) {
//             console.log('Cache hit');
//             return res.status(200).json(cachedData);
//         }

//         try {
//             const raw = await Purchase.find({ user_id: us._id });
//             const purchases = [];

//             for (const purchase of raw) {
//                 let user = await User.findById(purchase.user_id);
//                 if (user == null) {
//                     continue;
//                 }
//                 let pro = [];

//                 for (const items of purchase.products) {
//                     let product = await Product.findById(items.product_id);

//                     let name = product.name;
//                     let quantity = items.quantity;
//                     let price = product.price;
//                     pro.push({ name, quantity, price });
//                 }

//                 purchases.push({
//                     name: user.name,
//                     email: user.email,
//                     items: pro,
//                 });
//             }

//             purchaseCache.set(cacheKey, purchases);

//             res.header(
//                 'Access-Control-Allow-Origin',
//                 'https://food.rajb.codes',
//             );
//             res.header('Access-Control-Allow-Credentials', 'true');
//             res.status(200).json(purchases);
//         } catch (error) {
//             res.status(500).send({ error: 'Error fetching user purchases' });
//         }
//     },
// );
// purchaserouter.get(
//     '/purchase/today',
//     dbConnectionMiddleware,
//     async (req, res) => {
//         const today = new Date();
//         const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//         const endOfDay = new Date(today.setHours(23, 59, 59, 999));

//         try {
//             const orders = await Purchase.find({
//                 createdAt: { $gte: startOfDay, $lte: endOfDay },
//             }).select(['-__v', '-updatedAt']);
//             res.header(
//                 'Access-Control-Allow-Origin',
//                 'https://food.rajb.codes',
//             );
//             res.header('Access-Control-Allow-Credentials', 'true');
//             res.status(200).json(orders);
//         } catch (error) {
//             res.status(500).send({ error: "Error fetching today's orders" });
//         }
//     },
// );
// purchaserouter.get('/cart', dbConnectionMiddleware, auth, async (req, res) => {
//     const user = req.user;
//     const real_user = await User.findById(user._id);
//     const cart = real_user.cart;
//     const products = [];
//     cart.forEach(async (item) => {
//         const product = await Product.findById(item.product_id);
//         products.push({ product, quantity: item.quantity });
//     });
//     res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.json(products);
// });

// purchaserouter.post('/buy', dbConnectionMiddleware, auth, async (req, res) => {
//     const user = req.user;
//     const real_user = await User.findById(user._id);

//     const cart = real_user.cart;

//     const products = [];
//     let total = 0;
//     try {
//         for (const item of cart) {
//             const product = await Product.findById(item.product_id);

//             products.push({ product_id: product._id, quantity: item.quantity });

//             total += item.price * item.quantity;
//         }

//         const purchase = await Purchase.create({
//             user_id: user._id,
//             products: products,
//             total: total,
//         });
//         await User.findByIdAndUpdate(user._id, {
//             $set: { cart: [] },
//         });
//         res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
//         res.header('Access-Control-Allow-Credentials', 'true');
//         res.status(200).json(purchase);
//     } catch (error) {
//         res.status(401).json('eror in placing order');
//     }
// });
// purchaserouter.put(
//     '/purchase/:id/ready',
//     dbConnectionMiddleware,
//     async (req, res) => {
//         const { id } = req.params;
//         try {
//             const updatedOrder = await Purchase.findByIdAndUpdate(
//                 id,
//                 { isReady: true },
//                 { new: true },
//             );
//             res.header(
//                 'Access-Control-Allow-Origin',
//                 'https://food.rajb.codes',
//             );
//             res.header('Access-Control-Allow-Credentials', 'true');
//             res.status(200).send(updatedOrder);
//         } catch (error) {
//             res.status(500).send({ error: 'Error updating order status' });
//         }
//     },
// );

// export { purchaserouter };
import { Router } from 'express';
import { auth } from './userrouter.js';
import { Purchase } from '../Model/Purchase.model.js';
import User from '../Model/User.model.js';
import Product from '../Model/Product.model.js';
import { dbConnectionMiddleware } from '../db.js';

import { purchaseCache, orderCache, productCache } from '../cache.js';
const purchaserouter = Router();

// Get all purchases for a user
purchaserouter.get('/', dbConnectionMiddleware, auth, async (req, res) => {
    const user = req.user;
    const purchases = await Purchase.find({ user_id: user._id });

    res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.json(purchases);
});

// Get paginated purchases with caching
purchaserouter.get('/all', dbConnectionMiddleware, auth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const cacheKey = `orders_page_${page}_limit_${limit}`;

    const cachedData = orderCache.get(cacheKey);
    if (cachedData) {
        console.log('Cache hit');
        return res.status(200).json(cachedData);
    }

    try {
        const totalOrders = await Purchase.countDocuments();

        const raw = await Purchase.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const purchases = [];

        for (const purchase of raw) {
            let user = await User.findById(purchase.user_id);
            if (user == null) continue;

            let pro = [];
            for (const items of purchase.products) {
                let product = await Product.findById(items.product_id);
                pro.push({
                    name: product.name,
                    quantity: items.quantity,
                    price: product.price,
                });
            }

            purchases.push({
                name: user.name,
                email: user.email,
                items: pro,
                date: purchase.createdAt,
            });
        }

        const responseData = {
            orders: purchases,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
        };

        orderCache.set(cacheKey, responseData);

        res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching orders' });
    }
});

purchaserouter.get(
    '/username',
    dbConnectionMiddleware,
    auth,
    async (req, res) => {
        const us = req.user;
        const cacheKey = `user_${us._id}_purchases`;

        const cachedData = purchaseCache.get(cacheKey);
        if (cachedData) {
            console.log('Cache hit');

            return res.status(200).json(cachedData);
        }

        try {
            const raw = await Purchase.find({ user_id: us._id });
            const purchases = [];

            for (const purchase of raw) {
                let user = await User.findById(purchase.user_id);
                if (user == null) continue;

                let pro = [];
                for (const items of purchase.products) {
                    let product = await Product.findById(items.product_id);
                    pro.push({
                        name: product.name,
                        quantity: items.quantity,
                        price: product.price,
                    });
                }

                purchases.push({
                    name: us.name,
                    email: us.email,
                    items: Array.isArray(pro) ? pro : [],
                });
            }

            purchaseCache.set(cacheKey, purchases);

            res.header(
                'Access-Control-Allow-Origin',
                'https://food.rajb.codes',
            );
            res.header('Access-Control-Allow-Credentials', 'true');
            res.status(200).json(purchases);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching user purchases' });
        }
    },
);

// Get today's purchases
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
            }).select(['-__v', '-updatedAt']);

            res.header(
                'Access-Control-Allow-Origin',
                'https://food.rajb.codes',
            );
            res.header('Access-Control-Allow-Credentials', 'true');
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).send({ error: "Error fetching today's orders" });
        }
    },
);

// Get cart
purchaserouter.get('/cart', dbConnectionMiddleware, auth, async (req, res) => {
    const user = req.user;
    const real_user = await User.findById(user._id);
    const cart = real_user.cart;
    const products = [];

    for (const item of cart) {
        const product = await Product.findById(item.product_id);
        products.push({ product, quantity: item.quantity });
    }

    res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.json(products);
});

// Buy route with cache update after purchase
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
            total += product.price * item.quantity;
        }

        const newPurchase = await Purchase.create({
            user_id: user._id,
            products: products,
            total: total,
        });

        // Clear user's cart after purchase
        await User.findByIdAndUpdate(user._id, { $set: { cart: [] } });

        // Update user-specific purchase cache
        const userCacheKey = `user_${user._id}_purchases`;
        const cachedUserPurchases = purchaseCache.get(userCacheKey);
        if (cachedUserPurchases) {
            cachedUserPurchases.push(newPurchase);
            purchaseCache.set(userCacheKey, cachedUserPurchases);
        }

        res.header('Access-Control-Allow-Origin', 'https://food.rajb.codes');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.status(200).json(newPurchase);
    } catch (error) {
        res.status(401).json('Error in placing order');
    }
});

// Update purchase status to ready
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

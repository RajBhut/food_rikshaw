import mongoose from 'mongoose';

const product_scema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        price: {
            type: Number,
            require: true,
        },
        description: {
            type: String,
        },
        img_url: {
            type: String,
        },
        time: {
            type: String,
            require: true,
            enum: ['breakfast', 'lunch', 'dinner'],
        },
        everyday: {
            type: Boolean,
        },
        day: {
            type: String,
            require: true,
            enum: [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
                'sunday',
            ],
        },
        available: {
            type: Boolean,
            require: true,
            default: true,
        },
    },
    { timestamps: true },
);

const Product = mongoose.model('Product', product_scema);
export default Product;

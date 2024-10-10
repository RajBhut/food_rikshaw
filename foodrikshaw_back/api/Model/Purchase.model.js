import mongoose from 'mongoose';

const purchase_schema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        isReady: {
            type: Boolean,
            default: false,
        },
    },
    { strict: false, timestamps: true },
);

const Purchase = mongoose.model('Purchase', purchase_schema);
export { Purchase };

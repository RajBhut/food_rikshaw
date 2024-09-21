import mongoose from 'mongoose';
const purchase_schema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        total_price: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { strict: false, timestamps: true },
);

purchase_schema.methods.toJSON = function () {
    const purchase = this;
    const purchaseObject = purchase.toObject();
    delete purchaseObject.__v;
    return purchaseObject;
};

const Purchase = mongoose.model('Purchase', purchase_schema);
export default Purchase;

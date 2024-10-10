import mongoose from 'mongoose';

import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    cart: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number,
            },
        },
    ],
});

UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', async function (next) {
    this.password = bcrypt.hashSync(this.password, 10);

    next();
});
const User = mongoose.model('User', UserSchema);
export default User;

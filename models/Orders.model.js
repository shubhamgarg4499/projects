const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    order_status: { type: String, required: true, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    user_id: { type: String, required: true },
    order_items: [{
        product: { type: mongoose.Schema.ObjectId, required: true, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: mongoose.Schema.Types.Decimal128, required: true }
    }],
    total_amount: { type: Number, required: true, min: 0 },
    order_date: { type: Date, required: true, default: () => new Date() },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    shipping_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    phone_number: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

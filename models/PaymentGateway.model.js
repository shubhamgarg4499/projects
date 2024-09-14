const paymentGatewaySchema = new Schema({
    payment_gateway_id: { type: String, required: true, unique: true },
    gateway_name: { type: String, required: true },
    transaction_fees: { type: Number, required: true, min: 0 }
}, { timestamps: true });

const PaymentGateway = mongoose.model('PaymentGateway', paymentGatewaySchema);
module.exports = PaymentGateway;

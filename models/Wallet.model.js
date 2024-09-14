const walletSchema = new Schema({
    wallet_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, min: 0 }
}, { timestamps: true });

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;

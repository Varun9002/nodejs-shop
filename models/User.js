const { Schema, default: mongoose } = require('mongoose');
const product = require('./product');

const userSchema = new Schema({
    email: {
        type: String,
		required: true,
	},
    password: {
        type: String,
        required: true,
    },
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: { type: Number, required: true },
			},
		],
	},
});
userSchema.methods.addToCart = function (product) {
	const cartProductIndex = this.cart.items.findIndex(
		(cp) => product._id.toString() === cp.productId.toString()
	);
	const updatedCatItems = [...this.cart.items];
	let newQuantity = 1;
	if (cartProductIndex >= 0) {
		newQuantity += this.cart.items[cartProductIndex].quantity;
		updatedCatItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCatItems.push({
			productId: product._id,
			quantity: newQuantity,
		});
	}
	const updatedCart = {
		items: updatedCatItems,
	};
	this.cart = updatedCart;
	return this.save();
};

userSchema.methods.deleteProductFromCart = function (productId) {
	const updatedCartItems = this.cart.items.filter(
		(cp) => cp.productId.toString() !== productId.toString()
	);
	this.cart = { items: updatedCartItems };
	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

module.exports = mongoose.model('User', userSchema);

const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
	constructor(name, email, _id, cart) {
		this.name = name;
		this.email = email;
		this._id = _id;
		this.cart = cart;
	}

	save() {
		return getDb().collection('users').insertOne(this);
	}
	static findById(userId) {
		return getDb()
			.collection('users')
			.findOne({ _id: new ObjectId(userId) });
	}
	addToCart(product) {
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
		return getDb()
			.collection('users')
			.updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
	}

	getCart() {
		const prodIds = this.cart.items.map((p) => p.productId);
		return getDb()
			.collection('products')
			.find({ _id: { $in: prodIds } })
			.toArray()
			.then((products) => {
				return products.map((product) => {
					return {
						...product,
						quantity: this.cart.items.find(
							(i) =>
								product._id.toString() ===
								i.productId.toString()
						).quantity,
					};
				});
			});
	}
	deleteProductFromCart(prodId) {
		const updatedCartItems = this.cart.items.filter(
			(cp) => cp.productId.toString() !== prodId.toString()
		);
		return getDb()
			.collection('users')
			.updateOne(
				{ _id: this._id },
				{ $set: { cart: { items: updatedCartItems } } }
			);
	}

	addOrder() {
		return this.getCart()
			.then((products) => {
				const order = {
					items: products,
					user: { _id: this._id, name: this.name },
				};
				return getDb().collection('orders').insertOne(order);
			})
			.then((result) => {
				this.cart = { items: [] };
				return getDb()
					.collection('users')
					.updateOne(
						{ _id: this._id },
						{ $set: { cart: { items: [] } } }
					);
			});
	}
	getOrders() {
		return getDb()
			.collection('orders')
			.find({ 'user._id': this._id })
			.toArray();
	}
}
module.exports = User;

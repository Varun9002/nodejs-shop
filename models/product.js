const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class Product {
	constructor(title, price, description, imageUrl, id, userId) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = id ? new ObjectId(id) : id;
		this.userId = userId;
	}
	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			dbOp = db
				.collection('products')
				.updateOne({ _id: this._id }, { $set: this });
		} else {
			dbOp = db.collection('products').insertOne(this);
		}
		return dbOp
			.then((result) => {
				console.log(result);
				return result;
			})
			.catch((err) => {
				console.log(err);
			});
	}
	static fetchAll() {
		return getDb()
			.collection('products')
			.find()
			.toArray()
			.then((products) => {
				console.log(products);
				return products;
			})
			.catch((err) => {
				console.log(err);
			});
	}
	static findById(id) {
		console.log(id);
		return getDb()
			.collection('products')
			.find({ _id: new ObjectId(id) })
			.next()
			.then((product) => {
				console.log(product);
				return product;
			})
			.catch((err) => {
				console.log(err);
			});
	}
	static deleteById(prodId) {
		return getDb()
			.collection('products')
			.deleteOne({ _id: new ObjectId(prodId) })
			.then((result) => {
				console.log('Deleted');
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
module.exports = Product;

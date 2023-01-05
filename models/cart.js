const fs = require('fs');
const path = require('path');
const rootDir = require('./../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
	static addProduct(id, price) {
		fs.readFile(p, (err, fileContent) => {
			let cart = { products: [], totalPrice: 0 };
			if (!err) {
				cart = JSON.parse(fileContent);
			}
			const existingProductIndex = cart.products.findIndex(
				(prod) => prod.id == id
			);
			const existingProduct = cart.products[existingProductIndex];
			let updatedProduct;
			if (existingProduct) {
				updatedProduct = { ...existingProduct };
				updatedProduct.qty += 1;
				cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			} else {
				updatedProduct = { id: id, qty: 1 };
				cart.products = [...cart.products, updatedProduct];
			}
			cart.totalPrice += +price;
			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});
	}

	static deleteProduct(id, price) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				return;
			}
			const cart = JSON.parse(fileContent);
			const updatedCart = { ...cart };
			const product = updatedCart.products.find((p) => p.id === id);
			if (!product) {
				return;
			}
			const qty = product.qty;
			updatedCart.products = updatedCart.products.filter(
				(p) => p.id !== id
			);
			updatedCart.totalPrice -= qty * price;
			fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
				console.log('Error delete cart item=>' + err);
			});
		});
	}

	static getCart(cb) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				cb(null);
			} else {
				cb(JSON.parse(fileContent));
			}
		});
	}
};

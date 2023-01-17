const { default: mongoose, Schema } = require('mongoose');

const orderSchema = new Schema({
	products: [
		{
			product: { type: Object, required: true },
			quantity: { type: Number, required: true },
		},
	],
	user: {
		name: { type: String, required: true },
		userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
	},
});

module.exports = mongoose.model('Order', orderSchema);

// productId: {
//     _id: new ObjectId("63c6a8842e9ba521f39c2e39"),
//     title: 'Lol',
//     price: 2,
//     description: 'sdasdas',
//     imageUrl: 'https://www.pngpix.com/wp-content/uploads/2016/08/PNGPIX-COM-Milk-Churn-Can-PNG-Transparent-Image-500x456.png',
//     userId: new ObjectId("63bec7263b046f2911b75cf3"),
//     __v: 0
//   },
//   quantity: 1,
//   _id: new ObjectId("63c6a8932e9ba521f39c2e48")
// }

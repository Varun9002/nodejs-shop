const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
	MongoClient.connect(
		'mongodb+srv://Varun:mongolol@cluster0.vaxkbij.mongodb.net/shop?retryWrites=true&w=majority'
	)
		.then((res) => {
			console.log('Connected');
			_db = res.db();
			callback();
		})
		.catch((err) => {
			console.log(err);
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'no Database found ';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

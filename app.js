const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');
const User = require('./models/User');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
	User.findById('63bec7263b046f2911b75cf3')
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => {
			console.log(err);
		});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', errorController.get404);

mongoose
	.connect(
		'mongodb+srv://Varun:mongolol@cluster0.vaxkbij.mongodb.net/shop?retryWrites=true&w=majority'
	)
	.then((result) => {
		console.log('Connected');
		User.findOne().then((u) => {
			if (!u) {
				const user = new User({
					name: 'Varun',
					email: 'test@test.com',
					cart: { items: [] },
				});
				user.save();
			}
		});
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');
const User = require('./models/User');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
	User.findById('63bd4852585045f92dc545a7')
		.then((user) => {
			req.user = new User(user.name, user.email, user._id, user.cart);
			next();
		})
		.catch((err) => {
			console.log(err);
		});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', errorController.get404);

mongoConnect(() => {
	app.listen(3000);
});

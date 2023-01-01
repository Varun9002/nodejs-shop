const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');

const app = express();
app.engine(
	'hbs',
	expressHbs.engine({
		extname: 'hbs',
		defaultLayout: 'main-layout',
		layoutsDir: 'views/layouts/',
	})
);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use('/', (req, res, next) => {
	// res.status(404).sendFile(path.join(rootDir, 'views/404.html'));
	res.render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);

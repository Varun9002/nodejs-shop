const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');
const errorController = require('./controllers/error');
const db = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

// db.execute('SELECT * FROM products WHERE id=?', [1]).then(([p]) => {
// 	console.log(p);
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', errorController.get404);

app.listen(3000);

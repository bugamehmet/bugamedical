require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const compression = require('compression');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const adminProductRoutes = require('./routes/adminProducts');
const productRoutes = require('./routes/product');
const searchRoutes = require('./routes/search');
const sitemapRoutes = require('./routes/sitemap');
const contactRoutes = require('./routes/contact');
const pageRoutes = require('./routes/pages');

const app = express();
const port = process.env.PORT || 5001;

// DB
connectDB();

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
	}),
);

// Static
app.use('/assets', express.static('assets'));
app.use(express.static('views'));
app.use(express.static(path.join(__dirname, 'public')));

// View
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/', adminProductRoutes);
app.use('/', productRoutes);
app.use('/', searchRoutes);
app.use('/', sitemapRoutes);
app.use('/', contactRoutes);
app.use('/', pageRoutes);

// Server
app.listen(port, () => {
	console.log(`Server running on ${port}`);
});

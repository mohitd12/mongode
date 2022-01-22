// require environment varianbles
require('dotenv').config({ path: '.env.' + process.env.NODE_ENV });

const express = require('express');
const mongoose = require('mongoose');
const { name } = require('../package.json');
const routes = require('./routes');

// app instance
const app = express();

// server port
const PORT = process.env.PORT;

// mongo config
let mongoUri = [
	'mongodb://',
	process.env.MONGO_USER,
	':',
	process.env.MONGO_PASS,
	'@',
	process.env.MONGO_HOST,
	':',
	process.env.MONGO_PORT,
	'/',
	process.env.MONGO_DBNAME,
	'?authSource=admin'
];

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/api', routes);

// error not found
app.use('*', (req, res, next) => {
	res.status(404).json({ message: 'Resource requested not found.' });
});

// server exit handler
process.on('SIGINT', () => {
	console.log('📢 Server has exited');
	process.exit(1);
});

// mongo uri
mongoUri = mongoUri.join('');

// start mongodb
mongoose.connect(mongoUri, (err) => {
	if (err) {
		console.log("📢 Database couldn't connect at this moment: -\n", err);
		process.exit(1);
	}

	console.log('\n✅ %s is running...', name);

	console.log('\n✅ Database is connected.\n');

	// start server
	app.listen(PORT, () => {
		console.table({ Node_environment: process.env.NODE_ENV, Port: PORT });
	});
});

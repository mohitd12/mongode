// require environment varianbles
require('dotenv').config({ path: '.env.' + process.env.NODE_ENV });

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
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

// headers protection
app.use(helmet());

// cors enable
app.use(cors());

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/api', routes);

// error handler
app.use((err, req, res, next) => {
	if (err) {
		res.status(500).json({ message: err });
		throw err;
	} else {
		res.status(500).json({ message: 'Unknown server error' });
	}
});

// error not found
app.use('*', (req, res, next) => {
	res.status(404).json({ message: 'Resource requested not found.' });
});

// process events handler
process
	.on('SIGINT', () => {
		console.log('📢 Server has exited');
		process.exit(1);
	})
	.on('unhandledRejection', (reason, p) => {
		console.error(reason, 'Unhandled Rejection at Promise', p);
	})
	.on('uncaughtException', (err) => {
		console.error(err, 'Uncaught Exception thrown');
		process.exit(1);
	});

// mongo uri
mongoUri = mongoUri.join('');

// start mongodb
mongoose.connect(
	mongoUri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
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
	}
);

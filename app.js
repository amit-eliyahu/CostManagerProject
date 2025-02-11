const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const addRouter = require('./routes/add');
const reportRouter = require('./routes/report');
const aboutRouter = require('./routes/about');

const app = express();
const MONGO_URI = process.env.MONGO_URI;

/**
 * Connect to MongoDB.
 */
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB Atlas");

    const connection = mongoose.connection;
    connection.once('open', () => {
      console.log('MongoDB Atlas connection established successfully');
    });
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
  }
}

// Call the function to connect to the database
connectToDatabase();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set up middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Set up routes
app.use('/', indexRouter);
app.use('/api/add', addRouter);
app.use('/api/report', reportRouter);
app.use('/api/users', usersRouter);
app.use('/api/about', aboutRouter);

// Set up error handling
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


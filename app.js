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

console.log("MONGO_URI:", MONGO_URI);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

/*
// connection to database
mongoose.connect('mongodb+srv://amit270399:Amitnoam13@cluster0.0iyl5.mongodb.net/')
    .then(() =>
      console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.log("Error connecting to MongoDB Atlas:", err));
*/
  const connection = mongoose.connection;

  connection.once('open', () => {
    console.log('MongoDB Atlas connection established successfully');
    /*
    createBaseUser();
    */

  });

  /*
function createBaseUser() {
  User.findOne({ id: 123123 })
      .then((doc) => {
        if (!doc) {
          const defaultUser = new User({
            id: 123123,
            first_name: "mosh",
            last_name: "israeli",
          });

          return defaultUser.save()
              .then(() => console.log("Default user added to the database"));
        } else {
          console.log("User already exists in the database");
        }
      })
      .catch((err) => console.log("Error saving user:", err));
}
*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/api/add', addRouter);
app.use('/api/report', reportRouter);
app.use('/api/users', usersRouter);
app.use('/api/about', aboutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

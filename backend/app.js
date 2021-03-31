require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var methodOverride = require('method-override');//Позволяет использовать HTTP-команды,такие как PUT или DELETE
var path = require('path');
var cookieParser = require('cookie-parser');//функцию промежуточной обработки для корректной работы cookie в Express.
var logger = require('morgan');//для логера
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const pubPath = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(pubPath));

app.use('/', indexRouter);
app.use(bodyParser.json());
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send('error', { error: err });
});

module.exports = app;

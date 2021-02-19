require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var methodOverride = require('method-override');//Позволяет использовать HTTP-команды,
//такие как PUT или DELETE, в местах, где клиент не поддерживает их.
var path = require('path');
var cookieParser = require('cookie-parser');//функцию промежуточной обработки для корректной работы cookie в Express.
// для чего это нужно???
var logger = require('morgan');//для логера
//Каждый токен — это имя вида :url,
//и на месте каждого токена в заданном формате
//появляется значение, соответствующее текущему запросу

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var bodyParser = require('body-parser');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

app.use(logger('dev'));//для логера
app.use(express.json());//Это встроенная функция промежуточного программного
//обеспечения в Express. Он анализирует входящие запросы
//с полезной нагрузкой JSON и основан на парсере тела.
app.use(methodOverride('_method'));//использование
app.use(express.urlencoded({ extended: false }));//https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
app.use(cookieParser());
const pubPath = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(pubPath));//использоание статических файлов типа кратинки и css

app.use('/', indexRouter);
// for parsing application/json
app.use(bodyParser.json());// для чего тут опять
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

  // render the error page
  res.status(err.status || 500);
  res.render('error', { error: err });
});

module.exports = app;

const createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const bodyParser = require('body-parser');
const http = require('http')
const bcrypt = require('bcrypt')
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
var indexRouter = require('./routes/index');
const pgp = require('pg-promise')
var cors_proxy = require('cors-anywhere');

// Create the express app
const app = express()

// Error handlers

// app.use(cors());
// app.options('*', cors());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   next();
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use(process.env.PORT,function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500).send();
// });

app.use(function(req, res, next) {
  next(createError(404));
});

// Start server
const serverport = 1234;
const corsport = 8080;
const host= 'localhost'
app.listen(serverport, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Started at ${host}:${process.env.PORT}`)
})

// cors_proxy.createServer({
//   originWhitelist: [], // Allow all origins
//   requireHeader: ['origin', 'x-requested-with'],
//   removeHeaders: ['cookie', 'cookie2']
// }).listen(corsport, host, function() {
//   console.log('Running CORS Anywhere on ' + host + ':' + corsport);
// });

module.exports = app;
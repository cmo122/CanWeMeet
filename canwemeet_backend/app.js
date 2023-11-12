var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
require('dotenv').config();
const session = require("express-session");
var cors = require('cors');


// Create the express app
const app = express()
app.use(cors());




app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false }));
var indexRouter = require('./routes/index');
app.use('/', indexRouter);
app.use(function(req, res, next) {
  next(createError(404));
});

// Start server
const host= 'localhost'
app.listen(process.env.PORT, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Started at ${host}:${process.env.PORT}`)
})

module.exports = app;
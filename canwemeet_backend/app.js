const createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const session = require("express-session");
const cors = require('cors');
var indexRouter = require('./routes/index');
const {createClient}= require('@supabase/supabase-js')

// Create the express app
const app = express()

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(session({ secret: process.env.secretkey, resave: false, saveUninitialized: false }));

app.use(cookieParser());

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
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
require('dotenv').config();
const session = require("express-session");
const cors = require('cors');


// Create the express app
const app = express()

var indexRouter = require('./routes/index');
app.use('/', indexRouter);
app.use(cors({
  origin: 'https://canwemeet-frontend.fly.dev/', // Allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specified HTTP methods
  credentials: true, // Allow including credentials in cross-origin requests
  exposedHeaders: 'Content-Length,Content-Range', // Expose additional headers
  allowedHeaders: 'Content-Type,Authorization', // Allow specified headers
  optionsSuccessStatus: 204, // Set the status code for successful preflight requests
}));

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(session({ secret: process.env.secretkey, resave: false, saveUninitialized: false }));

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
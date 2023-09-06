'use strict'
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
const pgp = require('pg-promise')

const db = pgp('postgres://username:password@host:port/database')
// Create the express app
const app = express()

// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)

// Error handlers
app.use(function fourOhFourHandler (req, res) {
  res.status(404).send()
})
app.use(function fiveHundredHandler (err, req, res, next) {
  console.error(err)
  res.status(500).send()
})

app.use(logger('dev'));
app.use(express.json());
app.use(session({ secret: process.env.secretkey, resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(1234, function (err) {
  if (err) {
    return console.error(err)
  }

  console.log('Started at http://localhost:1234')
})

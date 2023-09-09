const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
require('dotenv').config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { createServerComponentClient } = require("@supabase/auth-helpers-nextjs");
const { cookies } = require("next/headers");

// exports.testing = (
//     asyncHandler(async (req, res, next) => {
//         console.log("test")
//         // res.status(200).send();
//     })
// )

exports.signIn_post = [
    body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("password", "Password must not be empty").trim().isLength({ min: 1 }).escape()
]

exports.signUp_post = [
    asyncHandler(async (req, res, next) => {
        console.log("test")
        next()
    })
    ,
    body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
    body("password", "Password must not be empty").trim().isLength({ min: 8 }).escape(),
    body('passwordConfirm').custom((value, { req }) => {
        return value === req.body.password;
      }).withMessage('Passwords must match'),

    asyncHandler(async (req, res, next) => {
        const supabase = createServerComponentClient({ cookies })
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        
        const { data, error } = await supabase
        .from('Users')
        .insert([
            {
                username: req.body.username,
                password: hashedPassword,
                events: {},
                freetime: {}
            },
        ])
        .select()
        console.log("made it!")
        res.status(200).send()
    })
    
]
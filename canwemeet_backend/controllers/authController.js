const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
require('dotenv').config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { createServerComponentClient } = require("@supabase/auth-helpers-nextjs");
const {createClient}= require('@supabase/supabase-js')


exports.signIn_post = [
    body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("password", "Password must not be empty").trim().isLength({ min: 1 }).escape()
]

exports.signUp_post = [
    body("username", "username is required")
    .trim()
    .isLength({ min: 4 })
    .escape()
    ,
    body("password", "Password must not be empty").trim().isLength({ min: 8 }).escape(),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
      }).withMessage('Passwords must match'),

    asyncHandler(async (req, res, next) => {
        
        const supabaseUrl = process.env.SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_ANON_KEY
        const supabase = createClient(supabaseUrl, supabaseKey)
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
        
        if (error) {
            console.error("woops! ",error.message);
            } else {
            console.log(data);
            }
        res.status(200).send()
    })
    
]
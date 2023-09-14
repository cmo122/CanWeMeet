const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js')

exports.createEvent = [
    asyncHandler(async (req, res, next) => {
        console.log(req.body)
        res.status(200).send()
    })
        
]
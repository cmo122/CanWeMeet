const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js')
const Hashids= require('hashids/cjs')


exports.createEvent = [
    asyncHandler(async (req, res, next) => {
        const hashids = new Hashids()

        console.log(hashids.encode(1,2,3))
        console.log("Request body", req.body)
        res.status(200).send()
    })
        
]
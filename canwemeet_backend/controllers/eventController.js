const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
require('dotenv').config();
const Hashids= require('hashids/cjs')
const { createServerComponentClient } = require("@supabase/auth-helpers-nextjs");
const {createClient}= require('@supabase/supabase-js')
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


function formatAsTimePG(timeString, timeMeridiem) {

    const timeParts = timeString.split(':');
    let hour = parseInt(timeParts[0]);
  
    if (timeMeridiem === 'pm' && hour < 12) {
        hour += 12;
    }
    
    if (hour < 10) {
        hour = '0' + hour; 
    }

    const formattedTimePG = `${hour}:${timeParts[1]}`;
  
    return formattedTimePG;
  }


exports.createEvent = [
    asyncHandler(async (req, res, next) => {
        const hashids = new Hashids()
        const newURL=hashids.encode(1,2,3)
        console.log("Request body", req.body)
        const initialTimeConverted= formatAsTimePG(req.body.initialTime, req.body.initialTimeMeridiem)
        const finalTimeConverted= formatAsTimePG(req.body.finalTime, req.body.finalTimeMeridiem)
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dates_format = Array.isArray(req.body.dates) && req.body.dates.length > 0;

        const sbData={
            eventID: newURL,
            eventName: req.body.eventName,
            initialTime: initialTimeConverted,
            finalTime: finalTimeConverted,
            timezone:userTimezone,
            dates_format: dates_format,
            dates: req.body.dates,
            days: req.body.days
        }
        const { data, error } = await supabase
        .from('Events')
        .insert(sbData);

        if (error) {
            console.error('Supabase error:', error);
            
            return res.status(500).json({ error: 'Failed to insert data into the database' });
          }

        res.status(200).json({ newURL });

    })
        
]
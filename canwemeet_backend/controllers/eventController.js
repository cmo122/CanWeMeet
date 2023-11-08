const asyncHandler = require("express-async-handler");
require('dotenv').config();
const Hashids= require('hashids/cjs')
const {createClient}= require('@supabase/supabase-js')
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


function formatAsTimePG(timeString, timeMeridiem) {
    if(timeString){
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
  }

exports.createEvent = [
    asyncHandler(async (req, res, next) => {
        // create new URL
        const salt = Date.now().toString();
        const hashids = new Hashids(salt, 6)
        const newURL=hashids.encode(1,2,3)
        // convert form values into UTC time
        const initialTimeConverted= formatAsTimePG(req.body.initialTime, req.body.initialTimeMeridiem)
        const finalTimeConverted= formatAsTimePG(req.body.finalTime, req.body.finalTimeMeridiem)
        const userTimezone = req.body.timezone

        const sbData={
            eventID: newURL,
            eventName: req.body.eventName,
            initialTime: initialTimeConverted,
            finalTime: finalTimeConverted,
            timezone:userTimezone,
            dates: req.body.dates,
            days: req.body.days,
            all_users_freetime:[]
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

exports.updateUserFreetime=[
    asyncHandler(async (req, res, next) => {
        const eventID= req.params.eventID
        const { data: eventData } = await supabase
        .from('Events')
        .select('all_users_freetime')
        .eq('eventID', eventID)
        .single();

        const currentAllUsersFreetime = eventData.all_users_freetime || [];

        const { name, timezone, freetime } = req.body;
        const existingUserIndex = currentAllUsersFreetime.findIndex(item => item.name === name);
        // create buffer using set to ensure no duplicates
        const uniqueFreetimeSet = new Set(freetime);
        const uniqueFreetimeArray = Array.from(uniqueFreetimeSet);
        if(existingUserIndex  !== -1){
            // user exists, append new freetime to existing users freetime
            currentAllUsersFreetime[existingUserIndex].freetime=uniqueFreetimeArray;
        }
        else{
            // user does not exist yet, push fresh json to column
            currentAllUsersFreetime.push({ name, timezone, freetime });
        }
        const { data, error } = await supabase
        .from('Events')
        .update({
            all_users_freetime: currentAllUsersFreetime,
        })
        .eq('eventID', eventID)
        .select();

        return res.status(200).json(data);
    })
    
]
    
exports.fetchEvent=[
    asyncHandler(async (req, res, next) => {
        const { data, error } = 
            await supabase
                .from('Events')
                .select('*')
                .eq('eventID', req.params.eventID)
                .single();
        if(error) return res.status(500).json({message: "Could not obtain event"})

        if (data) {
            res.status(200).json(data);
          } else {
            res.status(404).json({ message: "Event not found" });
          }
    })
]
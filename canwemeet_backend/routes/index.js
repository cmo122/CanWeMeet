var express = require('express');
var router = express.Router();
const authController = require("../controllers/authController")
const eventController=require("../controllers/eventController")

// Home page routes
router.post('/', eventController.createEvent);
// Sign in routes
router.post('/signin', authController.signIn_post);
router.post('/signup', authController.signUp_post);
// Event page routes
router.post('/:eventID', eventController.updateUserFreetime);

module.exports = router;
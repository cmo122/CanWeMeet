var express = require('express');
var router = express.Router();
const eventController=require("../controllers/eventController")

// Home page routes
router.post('/', eventController.createEvent);
// Event page routes
router.get('/:eventID', eventController.fetchEvent);
router.post('/:eventID', eventController.updateUserFreetime);

module.exports = router;
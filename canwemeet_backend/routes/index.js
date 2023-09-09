var express = require('express');
var router = express.Router();
const authController=require("../controllers/authController")

// Home page routes
// router.get('/', authController.testing);
// router.post('/', authController.testing);
// Sign in routes
router.post('/signin', authController.signIn_post);
router.post('/signup', authController.signUp_post);

module.exports = router;
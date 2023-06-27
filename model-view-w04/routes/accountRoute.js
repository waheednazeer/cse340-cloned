// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require('../utilities/index.js')
const accountController = require('../controllers/accountController.js'); 

// Route to build inventory by classification view
router.get('/login', accountController.login);




module.exports = router;
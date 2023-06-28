// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities= require('../utilities/index.js');
const errorController = require('../controllers/errorController.js'); 

// Route to build inventory by classification view
router.get('/error', utilities.Util.handleErrors(errorController.footerError));




module.exports = router;
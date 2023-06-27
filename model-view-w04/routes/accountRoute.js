// Needed Resources 
const express = require("express");
const router = new express.Router();
const accountController = require('../controllers/accountController.js'); 

// Route to build inventory by classification view
router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegister);




module.exports = router;
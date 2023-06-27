// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require('../utilities/index.js')
const accountController = require('../controllers/accountController.js'); 

// Route to build inventory by classification view
router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegister);

router.post('/register', utilities.Util.handleErrors(accountController.registerAccount))



module.exports = router;
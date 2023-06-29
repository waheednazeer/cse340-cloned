// Needed Resources 
const express = require("express");
const router = new express.Router();
const regValidate = require('../utilities/account-validation.js')
const utilities = require('../utilities/index.js')
const accountController = require('../controllers/accountController.js'); 

// Route to build inventory by classification view
router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegister);

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.Util.handleErrors(accountController.registerAccount)
  )
// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)


module.exports = router;
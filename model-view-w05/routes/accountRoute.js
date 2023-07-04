// Needed Resources 
const express = require("express");
const router = new express.Router();
const regValidate = require('../utilities/account-validation.js')
const utilities = require('../utilities/index.js')
const accountController = require('../controllers/accountController.js'); 

// Route to build inventory by classification view
router.get('/login', utilities.Util.handleErrors(accountController.buildLogin));
router.get('/register', utilities.Util.handleErrors(accountController.buildRegister));

// Route to login success page
router.get('/', utilities.Util.checkLogin, utilities.Util.handleErrors(accountController.buildLoginSuccess));


// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.Util.handleErrors(accountController.registerAccount)
  )
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.Util.handleErrors(accountController.accountLogin)
)

/** 
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)
*/


module.exports = router;
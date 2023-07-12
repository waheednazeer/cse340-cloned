// Needed Resources 
const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const regValidate = require('../utilities/account-validation.js')
const utilities = require('../utilities/index.js')
const accountController = require('../controllers/accountController.js'); 

// Route to build inventory by classification view
router.get('/login', utilities.Util.handleErrors(accountController.buildLogin));
router.get('/register', utilities.Util.handleErrors(accountController.buildRegister));
router.get('/update/:account_id', utilities.Util.handleErrors(accountController.buildUpdate));

// Route to login success page
router.get('/', utilities.Util.checkLogin, utilities.Util.handleErrors(accountController.buildLoginSuccess));


// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.Util.handleErrors(accountController.registerAccount)
  )
//Process the Update data
router.post(
  "/update",
  regValidate.accountUpdateRules(),
  regValidate.checkRegData,
  utilities.Util.handleErrors(accountController.updateAccount)
)
//Process the Update password
router.post(
  "/update-password",
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordData,
  utilities.Util.handleErrors(accountController.updatePassword)
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
  "/update",
  (req, res) => {
    res.status(200).send('update process')
  }
)*/



module.exports = router;
const utilities = require(".")
const accountModel = require("../models/account-model")

const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
        }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }
 /*  **********************************
 *  Update Data Validation Rules
 * ********************************* */
validate.accountUpdateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

  ]
}
/*  **********************************
 *  Update password Validation Rules
 * ********************************* */
validate.passwordUpdateRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
} 


  
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_id, account_email, account_firstname, account_lastname }  = req.body
  const ac_id = parseInt(account_id)
 
  let errors = []
  errors = validationResult(req)
  let msg=null;
  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      msg= error.msg
      console.log(msg);
   })
    
    req.flash("notice", msg);
    res.redirect('/account/update/'+ac_id)
    
  }
  next();
 
}
  
 /*  **********************************
 *  Account login Rules
 * ********************************* */ 
 validate.loginRules = () => {
  return [
    
    // valid email is required and cannot already exist in the database
      body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

      body("account_password")
      .trim()
      .isLength({min: 1})
      .withMessage("password can not be kept empty"),
  ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors);
    let nav = await utilities.Util.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id }  = req.body
  const ac_id = parseInt(account_id)
 
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
 
    req.flash("notice", "Password does not meet requirements.");
    res.redirect('/account/update/'+ac_id)
    
  }
  next();
}

  /*
    let user= res.locals.user;
    const { account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.Util.getNav()
      console.log(errors);
      req.flash("notice", "Sorry, the insert failed.");
        res.status(501).render("./account/update", {
        errors,
        title: "Update Account",
        nav,
        account_password,
        user,
      })
      return
    }
    next()
  }
*/


  module.exports = validate
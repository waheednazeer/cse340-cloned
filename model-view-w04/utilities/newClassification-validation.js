const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 2 })
        .isAlphanumeric()
        .withMessage("Classification name must be min 2 alphanumeric letters without space. "), // on error this message is sent.
    ]
    }
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.Util.getNav()
      res.render("./management/newClassification", {
        errors,
        title: "New Classification",
        nav,
        classification_name,
        
      })
      return
    }
    next()
  }

  module.exports = validate
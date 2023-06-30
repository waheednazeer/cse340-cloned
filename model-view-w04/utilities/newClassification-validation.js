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


/*  **********************************
 *  Vechicle Data Validation Rules
 * ********************************* */
validate.vehicleRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .isAlpha()
      .withMessage("Make: min 3 letters withouspace."), // on error this message is sent.

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model: must be min 3 letters."), // on error this message is sent.

      body("inv_description")
      .trim()
      .isLength({ min: 3})
      .withMessage("Description: can not be left empty."),

    // password is required and must be strong password
    body("inv_image")
      .trim()
      .isLength({ min: 5})
      .isString()
      .withMessage("Image Path: must be a valid path."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 5})
      .isString()
      .withMessage("Image Path: must be a valid path."),

    body("inv_year")
      .trim()
      .isLength({ min: 4 })
      .isInt()
      .withMessage("Year: must be 4 digit year"),
    
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("Price: must be integer"), 
    
      body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("Miles: must be integer/ decimal number"),

    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Color: must be letters"),
   // lastname is required and must be string
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification Id: must not be empty."), // on error this message is sent.
     // firstname is required and must be string

  ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  
  const { classification_id, inv_description, inv_make, inv_made, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.Util.getNav()
    let selectOptions = await utilities.Util.getClassificationOptions();
    
    res.render("./management/newVehicle", {
      
      errors,
      title: "New Vehicle",
      nav,
      selectOptions,
      inv_make, 
      inv_made, 
      inv_description,
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color,
      classification_id
    })
    return
  }
  next()
}




  module.exports = validate
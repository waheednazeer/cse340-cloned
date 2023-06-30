const managementModel = require("../models/management-model")
const utilities = require("../utilities/")



/* ***************************
 *  Build Management view
 * ************************** */
const buildManagement = async function (req, res, next) {
  try{
    let nav = await utilities.Util.getNav();
    
    res.render("./management/management", {
        title: "Vehicle Management ",
        message: "Vehicle Management System",
        nav,
        errors: null,      
    })
  } catch(error){
    let nav = await utilities.Util.getNav();
    res.render("./errors/error", {
      title: error,
      message: error,
      nav,
      
    })
  } 
}
/* ***************************
 *  New Classification view
 * ************************** */
const buildNewClassification = async function (req, res, next) {
    try{
      let nav = await utilities.Util.getNav();
      
      res.render("./management/newClassification", {
          title: "Add New Classification ",
          message: "Add New Classification ",
          nav,
          errors: null,      
      })
    } catch(error){
      let nav = await utilities.Util.getNav();
      res.render("./errors/error", {
        title: error,
        message: error,
        nav,
        
      })
    } 
  }
/* ***************************
 *  Add New Vehicle view
 * ************************** */
const buildNewVehicle = async function (req, res, next) {
    try{
      let nav = await utilities.Util.getNav();
      let selectOptions = await utilities.Util.getClassificationOptions();
      res.render("./management/newVehicle", {
          title: "Add New Vehicle ",
          message: "Add New Vehicle",
          nav,
          selectOptions,
          errors: null,     
      })
    } catch(error){
      let nav = await utilities.Util.getNav();
      res.render("./errors/error", {
        title: error,
        message: error,
        nav,
        
      })
    } 
  }
    
 
/* ****************************************
*  Process New Classification
* *************************************** */
async function addNewClassificationName(req, res) {

    let nav = await utilities.Util.getNav()
    const { classification_name } = req.body

 
  
    const regResult = await managementModel.addNewClassification(
      classification_name
    )
  
    if (regResult) {
    
        req.flash(
            "notice",
            `Congratulations, new classification ${classification_name} added.`
          )
      res.status(201).render("./management/management", {
        title: "Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, adding new classification name failed.")
      res.status(501).render("./management/newClassification", {
        title: "Classification",
        nav,
        errors: null,
      })
    }
  }

/* ****************************************
*  Process adding new vehicle into database
* *************************************** */
async function addNewVehicle(req, res) {

  let nav = await utilities.Util.getNav()
  let selectOptions = await utilities.Util.getClassificationOptions();
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

 
  const regResult = await managementModel.addNewVehicle(
     
    inv_make, 
    inv_model,
    inv_year,
    inv_description,  
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id 
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you have ${inv_make} ${classification_id} added into database.`
    )
    res.status(201).render("./management/management", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, adding vehicle failed.")
    res.status(501).render("./management/newVehicle", {
      title: "New Vehicle",
      nav,
      selectOptions,
    })
  }
}





module.exports = {buildManagement, buildNewClassification, buildNewVehicle, addNewClassificationName, addNewVehicle};
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
      
      res.render("./management/newVehicle", {
          title: "Add New Vehicle ",
          message: "Add New Vehicle",
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
      res.status(201).render("./management/newClassification", {
        title: "New Classification",
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




module.exports = {buildManagement, buildNewClassification, buildNewVehicle, addNewClassificationName};
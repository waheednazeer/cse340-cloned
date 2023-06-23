const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try{
    let nav = await utilities.Util.getNav();
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.Util.buildClassificationGrid(data);
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch(error){
    const grid=null;
    let nav = await utilities.Util.getNav();
    res.render("./errors/error", {
      title: "Server Internal Error ",
      message: "TypeError: Cannot read properties of undefined Item",
      nav,
      grid,
      
    })
  } 
}
/* ***************************
 *  Vehicle Detail inventory by detail view
 * ************************** */
invCont.detailByInvId = async function (req, res, next) {
  try{
    const inv_id = req.params.invId
    let nav = await utilities.Util.getNav();
    const data = await invModel.getInventoryDetailByinvId(inv_id)
    const grid = await utilities.Util.buildDetailGrid(data)
    const className = data[0].inv_make + ` ` + data[0].inv_model
    res.render("./detail/detailView", {
      title: className,
      nav,
      grid,
    })
  }catch(error){
    let nav = await utilities.Util.getNav();
    const grid=null;
    res.render("./errors/error", {
      title: "Server Internal Error ",
      message: "TypeError: Cannot read properties of undefined Item",
      nav,
      grid,
      
    })

  }
}





module.exports = {invCont};
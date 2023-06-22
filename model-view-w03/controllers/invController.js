const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.Util.buildClassificationGrid(data)
  let nav = await utilities.Util.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* ***************************
 *  Vehicle Detail inventory by detail view
 * ************************** */
invCont.detailByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryDetailByinvId(inv_id)
  const grid = await utilities.Util.buildDetailGrid(data)
  let nav = await utilities.Util.getNav()
  const className = data[0].classification_name
  res.render("./detail/detailView", {
    title: className + " vehicles",
    nav,
    grid,
  })
}





module.exports = {invCont};
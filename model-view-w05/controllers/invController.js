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
    //console.log(document.cookie)
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.Util.getNav()
  const itemData = await invModel.getInventoryDetailByinvId(inv_id)
  const classificationSelect = await utilities.Util.selectFromClassificationList(itemData[0].classification_id)
    
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/updateInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.Util.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.Util.selectFromClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/updateInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.Util.getNav()
  const itemData = await invModel.getInventoryDetailByinvId(inv_id)
  const classificationSelect = await utilities.Util.selectFromClassificationList(itemData[0].classification_id)
    
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/deleteInventory", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
    
  })
}


module.exports = {invCont};
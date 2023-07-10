// Needed Resources 
const express = require("express");
const router = new express.Router();
const regValidate = require('../utilities/newClassification-validation.js')
const utilities= require('../utilities/index.js');
const invController = require('../controllers/invController.js'); 

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.Util.handleErrors(invController.invCont.buildByClassificationId));

// Route to detail inventory by detail view- inv_id
router.get('/detail/:invId', utilities.Util.handleErrors(invController.invCont.detailByInvId));

router.get("/getInventory/:classification_id", utilities.Util.handleErrors(invController.invCont.getInventoryJSON));

// Inventory Edit route
router.get("/edit/:inv_id", utilities.Util.handleErrors(invController.invCont.editInventoryView));

// Inventory delete route
router.get("/delete/:inv_id", utilities.Util.handleErrors(invController.invCont.deleteInventoryView));


// route for update inventory
router.post(
    "/update/",
    regValidate.vehicleRules(),
    regValidate.checkInventoryData, 
    utilities.Util.handleErrors(invController.invCont.updateInventory))



module.exports = router;
// Needed Resources 
const express = require("express");
const router = new express.Router();
const regValidate = require('../utilities/newClassification-validation.js')
const utilities= require('../utilities/index.js');
const managementController = require('../controllers/managementController.js');
const accountController = require('../controllers/accountController.js');  

// Route to build management view
router.get('/', utilities.Util.handleErrors(accountController.buildLogin));
router.get('/newClassification', utilities.Util.handleErrors(managementController.buildNewClassification));
router.get('/newVehicle', utilities.Util.handleErrors(managementController.buildNewVehicle));

// Process the registration data
router.post(
    "/newClassification",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.Util.handleErrors(managementController.addNewClassificationName)
  )

 // Process the registration data
router.post(
  "/newVehicle",
  regValidate.vehicleRules(),
  regValidate.checkInventoryData,
  utilities.Util.handleErrors(managementController.addNewVehicle)
) 

module.exports = router;
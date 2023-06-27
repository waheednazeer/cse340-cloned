// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities= require('../utilities/index.js');
const invController = require('../controllers/invController.js'); 

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.Util.handleErrors(invController.invCont.buildByClassificationId));

// Route to detail inventory by detail view- inv_id
router.get('/detail/:invId', utilities.Util.handleErrors(invController.invCont.detailByInvId));



module.exports = router;
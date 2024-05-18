//Needed resources
const express = require('express');
const utilities = require('../utilities')
const router = express.Router();
const invController = require('../controllers/invController');
const inventoryValidate = require("../utilities/inventory-validation")


//Route to build inventory by classification view
router.get('/', utilities.handleErrors(invController.buildInvManagement));
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));
router.post('/add-classification',
 inventoryValidate.classificationRules(),
 inventoryValidate.checkClassificationData,
 utilities.handleErrors(invController.addClassification)
 )

router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryId));


module.exports = router;
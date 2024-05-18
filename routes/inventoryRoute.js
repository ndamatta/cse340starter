//Needed resources
const express = require('express');
const utilities = require('../utilities')
const router = express.Router();
const invController = require('../controllers/invController');

//Route to build inventory by classification view
router.get('/', invController.buildInvManagement);
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));
router.get('/detail/:inventoryId', utilities.handleErrors(invController.buildByInventoryId));


module.exports = router;
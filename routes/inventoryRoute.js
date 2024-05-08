//Needed resources
const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');

//Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);
router.get('/detail/:inventoryId', invController.buildByInventoryId);

module.exports = router;
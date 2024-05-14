//Needed resources
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const controller = require("../controllers/accountController")

//Routes
router.get('/login', utilities.handleErrors(controller.buildLogin));
router.get('/register', utilities.handleErrors(controller.buildRegistrer));

module.exports = router;


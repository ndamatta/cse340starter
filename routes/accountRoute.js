//Needed resources
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const controller = require("../controllers/accountController")
const registerValidate = require("../utilities/account-validation")

//Routes
router.get('/login', utilities.handleErrors(controller.buildLogin));
router.get('/register', utilities.handleErrors(controller.buildRegistrer));
router.post(
    "/register",
    registerValidate.registationRules(),
    registerValidate.checkRegData,
    utilities.handleErrors(controller.registerAccount)
  )
router.post(
  "/login",
  registerValidate.loginRules(),
  registerValidate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process')
  }
)


module.exports = router;


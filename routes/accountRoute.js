//Needed resources
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const controller = require("../controllers/accountController")
const accountValidate = require("../utilities/account-validation")

//Routes
router.get('/login', utilities.handleErrors(controller.buildLogin));
router.get('/register', utilities.handleErrors(controller.buildRegistrer));
router.post(
"/register",
  accountValidate.registationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(controller.registerAccount)
)
router.post(
  "/login",
 accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(controller.accountLogin)
)
router.get("/",
 utilities.checkLogin,
 utilities.handleErrors(controller.buildAccount))
 router.get("/update", utilities.handleErrors(controller.buildUpdate))
 router.post("/update-account-info",
  accountValidate.updateBasicInfoRules(),
  accountValidate.checkBasicInfoData,
  utilities.handleErrors(controller.updateAccount)
)
router.post("/update-account-password",
  accountValidate.updatePasswordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(controller.updatePassword)
)
router.get("/management",
 utilities.checkJWTToken,
 utilities.checkLogin,
 utilities.checkAdminAccess,
 utilities.handleErrors(controller.buildAccountManagement))
router.get('/management/update/:accountId',
 utilities.checkJWTToken,
 utilities.checkLogin,
 utilities.checkAdminAccess,
 utilities.handleErrors(controller.buildEditAccount)
 );
router.post("/management/update-account",
 accountValidate.updateBasicInfoRules(),
 accountValidate.checkBasicInfoData,
 utilities.handleErrors(controller.updateAccount)
)
router.post("/management/update-account-password",
 accountValidate.updatePasswordRules(),
 accountValidate.checkPasswordData,
 utilities.handleErrors(controller.updatePassword)
)
router.get('/management/delete/:accountId',
 utilities.checkJWTToken,
 utilities.checkLogin,
 utilities.checkAdminAccess, 
 utilities.handleErrors(controller.buildDeleteAccount));
router.post('/management/delete-account', utilities.handleErrors(controller.deleteAccount)
);

router.get("/logout", utilities.handleErrors(controller.accountLogout))

module.exports = router;


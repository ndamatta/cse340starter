const utilities = require('../utilities/')
const accountModel = require("../models/account-model")

const accountController = {}

accountController.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav();
    const grid = await utilities.buildLogin();
    res.render("./account/login", {
        title: "Login",
        nav,
        grid,
    });
}
accountController.buildRegistrer = async function (req, res, next) {
    let nav = await utilities.getNav()
    const grid = await utilities.buildRegister();
    res.render("./account/register", {
      title: "Register",
      nav,
      grid,
    })
  }
accountController.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const grid = await utilities.buildRegister();
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    console.log(req.body)
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
  
    if (regResult) {
      console.log("FIRST NAME",account_firstname)
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("./account/login", {
        title: "Login",
        nav,
        grid,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./account/register", {
        title: "Registration",
        nav,
        grid,
      })
    }
  }

module.exports = accountController
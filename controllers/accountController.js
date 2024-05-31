const utilities = require('../utilities/')
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {}

accountController.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./account/login", {
        title: "Login",
        nav,
        errors: null,
    });
}
accountController.buildRegistrer = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
accountController.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "success",
        `You has been registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("./account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
}
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
    })
  return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
    return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}
accountController.buildAccount = async function (req, res) {
let nav = await utilities.getNav();
res.render("./account/account", {
    title: "Account",
    nav,
    errors: null,
});
}
accountController.buildUpdate = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./account/update", {
      title: "Update Account",
      nav,
      errors: null,
  });
  }
accountController.updateAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email} = req.body
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
  
  if (!updateResult) {
    req.flash("notice", "We couldn't update the account information.")
    res.status(400).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    })
    return
  }
  // update locals with updated info
  const updatedInfo = await accountModel.getAccountById(account_id)
  res.locals.accountData.account_firstname = updatedInfo.account_firstname
  res.locals.accountData.account_lastname = updatedInfo.account_lastname
  res.locals.accountData.account_email = updatedInfo.account_email

  req.flash("success", "Your account information has been updated.")
  res.render("./account/update", {
      title: "Update Account",
      nav,
      errors: null,
  });
}
accountController.updatePassword = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password} = req.body
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "We couldn't update the account password.")
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }
  
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
  
  if (!updateResult) {
    req.flash("notice", "We couldn't update the account password.")
    res.status(400).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    })
    return
  }
  req.flash("success", "Your password has been updated.")
  res.render("./account/update", {
      title: "Update Account",
      nav,
      errors: null,
  });
}
accountController.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const resultData = await accountModel.getAllAccounts()

  if (!resultData) {
    req.flash("notice", "We couldn't show the account management.")
    res.render("./account/management", {
      title: "Account Management",
      nav,
      errors: null,
  });
  }
  const accountList = await utilities.buildAccountList(resultData)
  res.render("./account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountList,
  });
}
accountController.buildEditAccount = async function(req, res, next) {
  let nav = await utilities.getNav()
  const accountId = req.params.accountId
  const data = await accountModel.getAccountById(accountId)

  res.render('./account/update-account', {
      title: `Management Update Information`,
      nav,
      errors: null,
      data,
  })
}
accountController.buildDeleteAccount = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountId = parseInt(req.params.accountId);
  const data = await accountModel.getAccountById(accountId)
  
  res.render('./account/delete-account', {
    title: `Management Delete Account`,
    nav,
    errors: null,
    data,
  })
}
accountController.deleteAccount = async function (req, res, next) {
  const accountId = parseInt(req.body.account_id);
  let nav = await utilities.getNav()
  const data = await accountModel.getAccountById(accountId)
  const deleteResult = await accountModel.deleteAccount(accountId)

  if (deleteResult) {
    req.flash("success", `The account was successfully deleted.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("./account/account", {
    title: "Management Delete Account" ,
    nav,
    errors: null,
    data,
    })
  }
}
accountController.accountLogout = async function (req, res) {
  res.clearCookie('jwt'); 
  res.redirect('/'); 
};
module.exports = accountController
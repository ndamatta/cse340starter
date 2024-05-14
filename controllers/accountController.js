const utilities = require('../utilities/')

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

module.exports = accountController
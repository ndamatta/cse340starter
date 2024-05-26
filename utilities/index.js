const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

//Constructs the nav HTML unordered list
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul id='navLinks'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list += `
    <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
      ${row.classification_name}
    </a>
  `
    list += "</li>"
  })
  list += "</ul>"
  return list
}

//Build the Classification view HTML
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = `<ul id="inv-display">`
    data.forEach(vehicle => { 
      grid += `<li>
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })
    grid += `</ul>`
  } else { 
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`
  }
  return grid
}
Util.buildDetailGrid = async function(data) {
  let grid
  grid = `
  <div id="det-display">
    <div id="det-img">
      <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
    </div>
    <div id="det-details">
      <h2 id="det-subtitle">${data.inv_year} ${data.inv_make} ${data.inv_model} Details</h2>
      <span id="det-mileage">Mileage: ${data.inv_miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
      <span id="det-color">Color: ${data.inv_color.charAt(0).toUpperCase()}${data.inv_color.slice(1).toLowerCase()}</span>
      <p id="det-description">Description: ${data.inv_description}</p>
      <span id="det-price">$${new Intl.NumberFormat('en-US').format(data.inv_price)}</span>
    </div>
  </div>
  `
  return grid
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<label class="add-inventory-label">Classification'
  classificationList += '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  classificationList += "</label>"
  return classificationList
}
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {  
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
 Util.checkInventoryAccess = (req, res, next) => {
  const account_type = res.locals.accountData.account_type
   if (account_type === 'Employee' || account_type === 'Admin') {
    req.flash("success", "Access granted");
    next();
  } else {
    req.flash("notice", "Access denied");
    return res.redirect("/account/login");
  }
 }
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util
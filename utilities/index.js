const invModel = require("../models/inventory-model")
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
Util.buildLogin = async function() {
  let grid = `
  <div id="login-display">
  <form>
    <label class="login-label">Email
      <input type="email" name="account_email" placeholder="email@example.com" required>
    </label>
    
    <label class="login-label">Password
      <input type="password" name="account_password" placeholder="Password" required>
    </label>
    
    <button type="submit">Login</button>
  </form>
  <a href="/account/register">Don't have an account? Register here</a>
  </div>
  `
  
  return grid
}
Util.buildRegister = async function() {
  let grid = `
  <div id="register-display">
    <form action="/account/register" method="post">
      <label class="login-label">First name
        <input type="text" name="account_firstname" required>
      </label>
      
      <label class="login-label">Last name
        <input type="text" name="account_lastname" required>
      </label>

      <label class="login-label">Email 
        <input type="email" name="account_email" placeholder="email@example.com" required>
      </label>

      <label class="login-label">Password
        <a href="#" id="password-advice" title="Must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character">?</a> 
        <input type="password" name="account_password" id="register-password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" required>
      </label>
      <span id="show-password">Show password</span>
      
      <button type="submit">Register</button>
    </form>
  </div>
  `
  return grid
}
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util
//Main file, controlling the app

//Requires
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const utilities = require('./utilities/')
const session = require("express-session")
const pool = require("./database/")
const bodyParser = require("body-parser")

const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const baseController = require("./controllers/baseController")

//Session
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
//Express msgs middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//Routes
app.use(static)
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

//Local server info (.env)
const port = process.env.PORT
const host = process.env.HOST

//Log statement, confirming server operation
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

//Express error handler
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, it seems like we lost this page :('})
})

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

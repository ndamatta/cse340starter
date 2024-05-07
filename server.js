//Main file, controlling the app

//Requires
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const utilities = require('./utilities/')

const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")

//Routes
app.use(static)
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.use('/inv', inventoryRoute)
app.get('/', baseController.buildHome)

app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, it seems like we lost this page :(.'})
})

//Local server info (.env)
const port = process.env.PORT
const host = process.env.HOST

//Express error handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

//Log statement, confirming server operation
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

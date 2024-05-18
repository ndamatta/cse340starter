const InventoryModel = require("../models/inventory-model")
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim() 
        .notEmpty().withMessage("Classification name cannot be empty.")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Classification name must not contain special characters or spaces.")
    ]
  }

  validate.checkClassificationData = async (req, res, next) => {
    const classification_name = req.body.classification_name
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

  module.exports = validate
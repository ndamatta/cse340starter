const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

const invCont = {}

//Inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render('./inventory/classification', {
        title: className + ' vehicles',
        nav,
        grid,
    })
}

invCont.buildByInventoryId = async function(req, res, next) {
    const inventoryId = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inventoryId)
    const grid = await utilities.buildDetailGrid(data)
    let nav = await utilities.getNav()
   
    res.render('./inventory/detail', {
        title: `${data.inv_make} ${data.inv_model} Details`,
        nav,
        grid,
    })
}

invCont.buildInvManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render('./inventory/management', {
        title: "Inventory Management",
        nav,
        classificationSelect
    })
}

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render('./inventory/add-classification', {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

invCont.addClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classification_name = req.body.classification_name
    const classificationResult = await invModel.addClassification(classification_name)

    if (classificationResult) {
        let nav = await utilities.getNav()
        req.flash(
          "success",
          `You added the classification: ${classification_name}.`
        )
        res.status(201).render("./inventory/add-classification", {
          title: "Add Classification",
          nav,
          errors: null,
        })
      } else {
        req.flash("notice", "Sorry, the process failed.")
        res.status(501).render("./inventory/add-classification", {
          title: "Add Classification",
          nav,
          errors: null,
        })
      }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList();
  res.render('./inventory/add-inventory', {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
  })
}

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
  const inventoryResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

  if (inventoryResult) {
    let classificationList = await utilities.buildClassificationList();
      req.flash(
        "success",
        `You added the vehicle: ${inv_make} ${inv_model} to the inventory`
      )
      res.status(201).render("./inventory/add-inventory", {
        title: "Add to Inventory",
        nav,
        classificationList,
        errors: null,
      })
    } else {
      let classificationList = await utilities.buildClassificationList();
      req.flash("notice", "Sorry, the process failed.")
      res.status(501).render("./inventory/add-inventory", {
        title: "Add to Inventory",
        nav,
        classificationList,
        errors: null,
      })
    }
}
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
invCont.buildEditInventory = async function (req, res, next) {
  const inventoryId = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inventoryId)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render('./inventory/edit-inventory', {
    title: `Edit ${itemName}`,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}
module.exports = invCont
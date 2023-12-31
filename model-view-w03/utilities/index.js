const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+vehicle.inv_year + ` ` +vehicle.inv_make + ' ' + vehicle.inv_model 
      +'" ></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildDetailGrid = async function(data){
  let vName;
  let grid
  if(data.length > 0){
    grid = '<div id="vehicle-detail">'
    data.forEach(vehicle => { 
      grid += `<img src="`+ vehicle.inv_image +`" id="inv_image" alt="picture of lastet car `+vehicle.inv_model+`">`

      grid += `<div class="inv-detail">`
      vName=vehicle.inv_year + ` ` + vehicle.inv_make + ` ` + vehicle.inv_model;
      grid += `<div id="detail-h3">` +`<h3>`+ vName + `</h3>` + `</div>`
      
      grid += `<div id="inv_year">` + `Inv. Year: ` + vehicle.inv_year +`</div>`

      grid += `<div id="inv_miles">` + `Mileage: ` + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +`</div>`
      
      grid += `<div id="inv_price">`+ `Price: `+ 
      `$` + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</div>'

      grid += `<div id="inv_color">` + `Color: ` + vehicle.inv_color +`</div>`

      grid += `<div id="inv_description">` + `Detail: ` + vehicle.inv_description +`</div>`
      
      grid += `<div id="contact">` + `Interested? Please contact us! | cars@fake.com | 111-2222 ` +`</div>`

      grid += `</div>`
    })
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {Util};
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

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

/* ***********************************************************
 * buildClassificationList for edit inventory
 *********************************************************** */
Util.buildClassificationList = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = `<Select id=classificationList name=classification_id>`
  
  data.rows.forEach((row) => {
    list += `<option value=${row.classification_id}>`
    list += row.classification_name     
    list += `</option>`
  })
  list += `</select>`
  return list
}

/* ***********************************************************
 * Changing default option selected
 *********************************************************** */
Util.selectFromClassificationList = async function (classification_id) {
  let data = await invModel.getClassifications()
  let list = `<Select id=classificationList name=classification_id>`
  
  data.rows.forEach((row) => {
    if (row.classification_id == classification_id){
      list += `<option value=${row.classification_id} selected>`
      list += row.classification_name     
      list += `</option>`
    }else{
    list += `<option value=${row.classification_id}>`
    list += row.classification_name     
    list += `</option>`
    }
  })
  list += `</select>`
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
      +'" alt="picutre of excellent used '+vehicle.inv_year + ` ` +vehicle.inv_make + ' ' + vehicle.inv_model 
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
* Middleware to check token validity
**************************************** */
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

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
/* ****************************************
 * Middleware For checking user from cookies
 **************************************** */
 Util.checkUser = async(req, res, next)=>{
  
  let token= req.cookies.jwt;
  
  if(token){
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken)=>{
      if(err){
        res.locals.user= null;
      }else{
        //console.log(decodedToken);
        let user= decodedToken;
        res.locals.user= user;
        next();
      }
   })
  }else{
    res.locals.user= null;
    next();
  } 
 }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {Util};
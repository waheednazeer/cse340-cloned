/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const session = require('express-session');
const pool = require('./database/index.js');
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const utilities= require('./utilities');
const baseController = require("./controllers/baseController");
const accountController = require('./controllers/accountController.js');
const static = require("./routes/static");
const inventoryRoute= require('./routes/inventoryRoute.js');
const accountRoute = require('./routes/accountRoute.js')



/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//View Engine and Templates
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/

app.use(static);

// index route
app.get('/', utilities.Util.handleErrors(baseController.buildHome));
app.get('/', utilities.Util.handleErrors(accountController.buildLogin));

// Inventory routes
app.use("/inv", inventoryRoute);

// account page route
app.use('/account', accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Ohh, we can not serve you. Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.Util.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
});



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/

const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

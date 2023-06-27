const utilities = require("../utilities/");


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.Util.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }

  async function buildRegister(req, res, next) {
    let nav = await utilities.Util.getNav()
    res.render("account/register", {
      title: "New Account Registration Form",
      nav,
    })
  }

module.exports = {buildLogin, buildRegister};
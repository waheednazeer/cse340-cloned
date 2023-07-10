const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const accountModel = require('../models/account-model');

dotenv.config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.Util.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.Util.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

  /* ****************************************
*  Deliver Update view
* *************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.Util.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  console.log(accountData.account_firstname);
  //const { account_firstname, account_lastname, account_email } = req.body
   
  res.render("account/update", {
    title: "Update your account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname, 
    account_lastname: accountData.account_lastname, 
    account_email: accountData.account_email,
    account_id: account_id

  })
}

  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {

    let nav = await utilities.Util.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res, next) {
  let nav = await utilities.Util.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   res.cookie("AccountType", accountData.account_type);
   //console.log('Cookies: ', req.cookies)
   /*
   const token= req.cookies.jwt;
   console.log('token: ', token)
   
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken)=>{
     
        console.log(decodedToken);
        let user= decodedToken.account_type;
        console.log("User"+ user);
        next();
   
    })*/

   
   
  //verif ends
   return res.redirect("/account/")
   }else{
    req.flash("notice", "Please check your password and try again.")
    res.status(400).render("account/login", {
     title: "Login",
     nav,
     errors: null,
     account_email,
    })
   }

  } catch (err) {
   return new Error('Access Forbidden')

  }
 }


  

 /* ****************************************
*  Deliver login Success view
* *************************************** */
async function buildLoginSuccess(req, res, next) {
  let nav = await utilities.Util.getNav();
  let managementInv;
  let updateAccount; 
  let user= res.locals.user;
  let userType;
  if(user){
    if(user.account_type== 'client'){
      userType= user.account_type;
      managementInv = null;
      updateAccount = `<p class="updateLink"><a href="/account/update/`+ user.account_id +`">`+ `Update your account`+ `</a>`+`</p>`
    }else{
      userType= user.account_type;
      updateAccount = `<p class="updateLink"><a href="/account/update/`+ user.account_id +`">`+ `Update your account`+ `</a>`+`</p>` 
      managementInv = `<p class="updateLink"><a href="/inv">`+ `Manage Inventory`+ `</a>`+`</p>` 
    }

  }

  req.flash(
    "notice",
    `You are loged in.`
  )
  res.status(201).render("account/loginSuccess", {
    title: "Welcome " + userType,
    nav,
    errors: null,
    updateAccount,
    managementInv,
  })

}


/* ***************************
 *  Update Account Data
 * ************************** */
const updateAccount = async function (req, res, next) {

  let nav = await utilities.Util.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,

  } = req.body
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  )

  if (updateResult) {
    const itemName = updateResult.account_firstName;
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/account")
  } else {
   
    const itemName = updateResult.account_firstname;
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("account/loginSuccess", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}




module.exports = {
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildLoginSuccess,
  buildUpdate,
  updateAccount,
};
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
    res.clearCookie("jwt");
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
     
  res.render("account/update", {
    title: accountData.account_firstname + ": Update your account",
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
      let user= null;
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        user,
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
  res.clearCookie("jwt");
  let nav = await utilities.Util.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    let user= null;
   req.flash("notice", "Your are not registered, please register then login.")
   res.status(400).render("account/register", {
    title: "Login",
    nav,
    errors: null,
    account_email,
    user,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   res.cookie("AccountType", accountData.account_type);
   
   return res.redirect("/account/")
   }else{
    let user = null;
    req.flash("notice", "Please check your password and try again.")
    res.status(400).render("account/login", {
     title: "Login",
     nav,
     errors: null,
     account_email,
     user,
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
  let managementInv = null;
  let updateAccount = null;
  let deleteAccount = null;
  let manageAccounts = null; 
  let user= res.locals.user;
  const accountData = await accountModel.getAccountById(user.account_id)
  user.account_firstname= accountData.account_firstname;
  
  let userType;
  if(user){
    if(user.account_type== 'client'){
      userType= user.account_firstname;
      managementInv = null;
      updateAccount = `<p class="updateLink"><a href="/account/update/`+ user.account_id +`">`+ `Update your account`+ `</a>`+`</p>`
      deleteAccount = `<p class="updateLink"><a href="/account/delete/`+ user.account_id +`">`+ `Delete your account`+ `</a>`+`</p>`
    }else{
      if(user.account_type== 'admin'){
      userType= user.account_firstname;
      updateAccount = `<p class="updateLink"><a href="/account/update/`+ user.account_id +`">`+ `Update your account`+ `</a>`+`</p>` 
      managementInv = `<p class="updateLink"><a href="/inv">`+ `Manage Inventory`+ `</a>`+`</p>` 
      manageAccounts = `<p class="updateLink"><a href="/account/accountManagement">`+ `Manage Accounts`+ `</a>`+`</p>`
    }else{
      userType= user.account_firstname;
      updateAccount = `<p class="updateLink"><a href="/account/update/`+ user.account_id +`">`+ `Update your account`+ `</a>`+`</p>` 
      managementInv = `<p class="updateLink"><a href="/inv">`+ `Manage Inventory`+ `</a>`+`</p>` 
    }
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
    deleteAccount,
    manageAccounts,
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
   
    let errors= null;
    if(errors == null)
    {
      req.flash("notice", `Account Updated`)
    }
   
    res.redirect('/account');
   
  } else {
   
    const itemName = updateResult.account_firstname;
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("account/loginSuccess", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

/* ***************************
 *  Update Account Password
 * ************************** */
const updatePassword = async function (req, res, next) {

  let nav = await utilities.Util.getNav()
  const {
    account_password,
    account_id,

  } = req.body

   // Hash the password before storing
   let hashedPassword
   try {
     // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10)
   } catch (error) {
     req.flash("notice", 'Sorry, there was an error processing the registration.')
     res.status(500).render("/account", {
       title: "Account Updated",
       nav,
       errors: null,
     })
   }

  //console.log("account_id "+ account_id);

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id,
  )

  if (updateResult) {
    
    let errors= null;
    if(errors == null)
    {
      req.flash("notice", `Password Updated`)
    }
        
    //res.clearCookie("jwt");
    res.redirect("/account")
  } else {
   
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("account/loginSuccess", {
    title: "Edit ",
    nav,
    errors: null,
    account_password,
    account_id
    })
  }
}


  /* ****************************************
*  Deliver Delete view
* *************************************** */
async function buildDeleteAccountView(req, res) {
  let nav = await utilities.Util.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
     
  res.render("account/delete", {
    title: accountData.account_firstname + ": Do you really want to delete your account?",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname, 
    account_lastname: accountData.account_lastname, 
    account_email: accountData.account_email,
    account_id: account_id
})
}


/* ***************************
 *  process Delete Account Data
 * ************************** */
const deleteAccount = async function (req, res) {

  let nav = await utilities.Util.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,

  } = req.body
  const updateResult = await accountModel.deleteAccount(
    account_id,
  )

  if (updateResult) {
    const itemName = "You account from our database";
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.clearCookie("jwt");
    res.redirect("/account/register")
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

  /* ****************************************
*  Deliver Delete view
* *************************************** */
async function buildAccountManagementView(req, res) {
  let nav = await utilities.Util.getNav()
  let user= res.locals.user;
  let accountSelect = await utilities.Util.buildAccountList();
  console.log(accountSelect);
  if(user.account_type == 'admin'){
    res.render("account/accountManagement", {
      title:"Manage Account Data",
      nav,
      errors: null,
      accountSelect,
      user,
  })

  }else{
    req.flash("notice", `FORBIDDEN`);
    res.redirect("/account")

  }  
}

/* ***************************
 *  Return account by acccount id As JSON
 * ************************** */
const getAccountJSON = async (req, res, next) => {
  const account_id = parseInt(req.params.account_id)
  console.log("in Account Controller "+account_id);
  const accountData = await accountModel.getAccountById(account_id);
  
  if (accountData.account_id) {
    console.log("JSON RETURNED");
    return res.json(accountData)
  } else {
    next(new Error("No data returned"))
  }
  next();
}

module.exports = {
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildLoginSuccess,
  buildUpdate,
  updateAccount,
  updatePassword,
  buildDeleteAccountView,
  deleteAccount,
  buildAccountManagementView,
  getAccountJSON,
};
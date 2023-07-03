const utilities = require("../utilities/")
const errorController = {}


errorController.footerError = async (req, res, next) => {
    try{
    const nav = await utilities.Util.getNav()
    abc // undefined, getting error
    res.render("./errors/error", {
        title: "Internal Server Error", 
        nav,
        message: "500 Internal Server Error", 
        
    })
}catch(error){
    const nav = await utilities.Util.getNav()
    res.render("./errors/error", {
        title: error, 
        nav,
        message: error, 
        
    })
}
}

module.exports= errorController;
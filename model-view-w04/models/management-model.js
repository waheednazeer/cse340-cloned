const pool = require("../database/index.js");

/* *****************************
*   Register new account
* *************************** */
async function addNewClassification(classification_name){
    try {
      console.log(checkExistingClassificationName(classification_name));
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingClassificationName(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    console.log(sql);
    const email = await pool.query(sql, [classification_name])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

  module.exports= {addNewClassification, checkExistingClassificationName};
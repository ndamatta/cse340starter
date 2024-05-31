const pool = require("../database/")

// Register new account
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1 "
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email FROM public.account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No account with provided ID")
  }
}
async function updateAccount( account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $2, account_lastname = $3, account_email = $4 WHERE account_id = $1";
    const data = await pool.query(sql, [account_id, account_firstname, account_lastname, account_email]);
    return data.rowCount;
  } catch (error) {
    console.error("Update Account Error:", error);
  }
}
async function updatePassword( account_id, hashedPassword) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $2 WHERE account_id = $1";
    const data = await pool.query(sql, [account_id, hashedPassword]);
    return data.rowCount;
  } catch (error) {
    console.error("Update Account Error:", error);
  }
}
async function getAllAccounts () {
  try {
    const result = await pool.query('SELECT account_id, account_firstname, account_lastname, account_email FROM public.account');
    return result.rows; // Extract the rows from the query result
  } catch (error) {
    throw new Error("Error retrieving accounts");
  }
}
async function deleteAccount(account_id) {
  try {
    const sql =
      "DELETE FROM public.account WHERE account_id = $1"
    const data = await pool.query(sql, [account_id])
    return data
  } catch (error) {
    console.error("Delete Account Error: " + error)
  }
}
module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword, getAllAccounts, deleteAccount };
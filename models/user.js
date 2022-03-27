/** User class for message.ly */
const db = require("../db");
const ExpressError = require("../expressError");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    const hashedPwd = await bcrypt.hash(password, 12)
      const results = await db.query(`
      INSERT INTO users
      (username, password, first_name, last_name, phone, join_at, last_login_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING username, password, first_name, last_name, phone
      `,
      [username, hashedPwd, first_name, last_name, phone, new Date(), new Date()])
      return results.rows[0]
   }

  /** Authenticate: is this username/password valid? Returns boolean. */


  static async authenticate(username, password) {
    const results = await db.query(`
    SELECT username, password FROM 
    users WHERE username=$1
    `, [username])
    const user = results.rows[0]
    const validate = await bcrypt.compare(password, user.password)
    if (!user || !validate ){
      return false
    }
    return true
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const results = await db.query(`
    UPDATE users 
    SET last_login_at = current_timestamp
    WHERE username =$1
    RETURNING username`, 
    [username])
    console.log(results.rows[0])
    if (!results.rows[0]){
      throw new ExpressError('User cannot be Found')
    }
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query(`
      SELECT username, first_name, last_name, phone FROM users
    `)
    return results.rows
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const results = await db.query(`
      SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users WHERE username=$1
    `, [username])
    if (!results.rows[0]){
      throw new ExpressError('User cannot be Found')
    }
    return results.rows[0]
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const results = await db.query(`
        SELECT id, to_username as to_user, body, sent_at, read_at FROM messages 
        WHERE from_username=$1
      `, [username])
      if (!results.rows[0]){
        throw new ExpressError('User cannot be Found')
      }
      const fr = await Promise.all(results.rows.map(async (r) => {
        const res = await db.query(`
        SELECT username, first_name, last_name, phone
        FROM users WHERE username = $1
        `, [r.to_user])
        // console.log(r)
        // console.log(res.rows[0])
        r.to_user = res.rows[0]
        return r
        // console.log(r)
      }))
      console.log(fr)
      return results.rows
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const results = await db.query(`
        SELECT id, from_username as from_user, body, sent_at, read_at FROM messages 
        WHERE to_username=$1
      `, [username])
      console.log(results.rows)
      if (!results.rows[0]){
        throw new ExpressError('User cannot be Found')
      }
      const fr = await Promise.all(results.rows.map(async (r) => {
        const res = await db.query(`
        SELECT username, first_name, last_name, phone
        FROM users WHERE username = $1
        `, [r.from_user])
        // console.log(r)
        // console.log(res.rows[0])
        r.from_user = res.rows[0]
        return r
        // console.log(r)
      }))
      console.log(fr)
      return results.rows
}}


module.exports = User;
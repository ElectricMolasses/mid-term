/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
//sherry test
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log(req.session);
    // Needs to check for a users cookie, and treat
    // them as signed in if it exists.
    res.send('yolo');
  }),

  router.get("/login", (req, res) => {
    console.log(req.session);
    req.session.id = 1;
    console.log('I sure tried!');
    res.redirect("/user");
    // Logins will query to confirm email and password.
    // Will use bcrypt to hash at final stage.
    // Assigns users token to a cookie for repeat authentication.
    // db.query(`SELECT * FROM users;`)
    //   .then(data => {
    //     const users = data.rows;
    //     res.json({ users });
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
  });
  return router;
};
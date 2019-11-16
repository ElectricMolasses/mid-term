/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
//sherry test
const express = require('express');
const router  = express.Router();
const path = require('path');

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log(req.session);
    //res.sendFile('/views/user/user.html', { root: '../../' });
    res.sendFile(path.resolve('./views/user/user.html'));
    // Needs to check for a users cookie, and treat
    // them as signed in if it exists.
  }),

  router.get("/update", (req, res) => {
    // Will be sent repeatedly while an order is active to keep the client updated.
  });

  router.post("/login", (req, res) => {
    console.log(res);
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

  router.post("/logout", (req, res) => {
    // It is what it is.
  });

  router.post("/signup", (req, res) => {
    // Register a new user (STRETCH)
  });

  router.post("/order", (req, res) => {
    // Submit information to create an order and notify the restaurant.
  });
  
  return router;
};
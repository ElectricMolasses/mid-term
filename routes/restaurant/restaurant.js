/*
 * All routes for Restaurants are defined here
 * Since this file is loaded in server.js into api/restaurants,
 *   these routes are mounted onto /restaurants
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const path = require('path');

module.exports = (db) => {
  router.get("/", (req, res) => {
    //res.sendFile('/views/restaurant/restaurant.html', { root: '../../' });
    res.sendFile(path.resolve('./views/restaurant/restaurant.html'));
  }),

  router.get("/update")

  router.post("/login", (req, res) => {
    // Just login.
  });
  return router;
};
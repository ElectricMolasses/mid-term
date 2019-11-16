/*
 * All routes for Restaurants are defined here
 * Since this file is loaded in server.js into api/restaurants,
 *   these routes are mounted onto /restaurants
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const path = require('path');

// FIRST STEP
// Orders first, items on order, time customer submitted.
// {}

module.exports = (db) => {
  router.get("/", (req, res) => {
    //res.sendFile('/views/restaurant/restaurant.html', { root: '../../' });
    res.sendFile(path.resolve('./views/restaurant/restaurant.html'));
  }),

  router.get("/orders", (req, res) => {

    return db.query(`
    SELECT CONCAT(users.first_name, ' ', 
          INITCAP(LEFT(users.last_name, 1))),
       users.phone_number, orders.id,
       items.name, items.cost, time_placed, time_confirmed, time_complete
    FROM restaurants
      JOIN orders ON (restaurant_id = restaurants.id)
      JOIN users ON (customer_id = users.id)
      JOIN order_items ON (order_id = orders.id)
      JOIN items ON (item_id = items.id);
    `, [])
      .then(query => {
        res.json(query.rows);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message});
      });
  });

  router.get("/update", (req, res) => {
    // Needs to be notified when a user makes an order to this database.  Going to build the users order query first, then work on this.
  });

  router.post("/login", (req, res) => {
    // Just login.
  });
  return router;
};
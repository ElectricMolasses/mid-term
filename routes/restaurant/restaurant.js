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

<<<<<<< HEAD
  router.get("/orders", (req, res) => {

    return db.query(`
    SELECT CONCAT(users.first_name, ' ', 
          INITCAP(LEFT(users.last_name, 1))) AS customer,
       users.phone_number, orders.id,
       items.name AS order_item, items.cost AS item_cost, time_placed, time_confirmed, time_complete
    FROM restaurants
      JOIN orders ON (restaurant_id = restaurants.id)
      JOIN users ON (customer_id = users.id)
      JOIN order_items ON (order_id = orders.id)
      JOIN items ON (item_id = items.id);
    `, [])
      .then(query => {
        console.log(query.rows);
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
=======
  router.get("/update")
>>>>>>> 780a8fb9da4a26244a41861e11de6b6c8e1aa7e7

  router.post("/login", (req, res) => {
    // Just login.
  });
  return router;
};
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

    res.sendFile(path.resolve('./views/restaurant/restaurant.html'));
  }),

  router.get("/orders", (req, res) => {
    const pending = [];

    return db.query(`
    SELECT orders.id AS id,
      CONCAT(users.first_name, ' ',
          INITCAP(LEFT(users.last_name, 1))) AS customer,
       users.phone_number, orders.id,
       items.name AS order_item, items.cost AS item_cost,
       time_placed, time_confirmed, time_complete
    FROM restaurants
      JOIN orders ON (restaurant_id = restaurants.id)
      JOIN users ON (customer_id = users.id)
      JOIN order_items ON (order_id = orders.id)
      JOIN items ON (item_id = items.id);
    `, [])
      .then(query => {
        console.log(query.rows);
        const orders = query.rows;
        return (async () => {
          for (const order of orders) {
            // order.id for next param.
            order.items = [];
            order.items.push(await db.query(`
            SELECT items.name AS name, items.cost AS cost, COUNT(items) AS quantity
            FROM orders
              JOIN order_items ON (order_id = orders.id)
              JOIN items ON (item_id = items.id)
            WHERE orders.id = $1
            GROUP BY items.name, items.cost;
            `, [order.id]));
            console.log('After await', order.items.rows);
          }
          console.log('Ever after await', orders[0].items.rows);
          return orders;
        })();
      })
      .then((query) => {
        res.json(query.rows);
      });
    // .then(query => {
    //   const orders = query.rows;
    //   for (const order of orders) {
    //     order.items = [
    //       db.query(`
    //         SELECT items.name AS name, items.cost AS cost, COUNT(items) AS quantity
    //         FROM orders
    //           JOIN order_items ON (order_id = orders.id)
    //           JOIN items ON (item_id = items.id)
    //         WHERE orders.id = $1
    //         GROUP BY items.name, items.cost;
    //       `, [order.id])
    //         .then(() => {
              
    //         })
    //     ];
    //     pending.push(...order.items);
    //   }
    // })
    // .catch(err => {
    //   res
    //     .status(500)
    //     .json({ error: err.message });
    // });
  });

  router.get("/update", (req, res) => {
    // Needs to be notified when a user makes an order to this database.  Going to build the users order query first, then work on this.
    // Will repeat polls to the db as an update loop.  Since order ID's are always unique, it will check them against a Set, and if anything
    // has changed, one of the ID's the user provides won't match.
    const restCache = req.body.orderIds;  // Will be a Set.

    return db.query(`
    SELECT id,
    FROM orders;
    `, [])
      .then(query => {
        const dbCache = query.rows;
        for (const result of dbCache) {
          if (!restCache.has(result.id)) {
            // There's been an update, re-render page.
            res.redirect("/orders");
            return;
          }
        }
        res.json({ success: 'Up to date' });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/login", (req, res) => {
    return db.query(`
    SELECT user_token
    FROM users
    WHERE email = $1
      AND password = $2;
  `, [req.body.email.trim(), req.body.password.trim()])
    .then(query => {
      req.session.userToken = query.rows[0].user_token;
      res.send({ success: "Logged in" });
    })
    .catch(err => {
      res.send({ error: err.message });
    });
  });

  return router;
};

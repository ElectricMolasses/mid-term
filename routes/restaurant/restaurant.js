/*
 * All routes for Restaurants are defined here
 * Since this file is loaded in server.js into api/restaurants,
 *   these routes are mounted onto /restaurants
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const path = require('path');

module.exports = (db, twilio) => {
  router.get("/", (req, res) => {

    res.sendFile(path.resolve('./views/restaurant/restaurant.html'));
  }),

  router.get("/orders", (req, res) => {

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
        const data = query.rows;
        const uniqueOrders = {};
        const formattedOutput = [];

        for (const order of data) {
          if (!uniqueOrders.hasOwnProperty(order.id)) {
            uniqueOrders[order.id] = order;
            uniqueOrders[order.id].items = [{
              name: order.order_item,
              cost: order.item_cost
            }];
            delete uniqueOrders[order.id].order_item;
            delete uniqueOrders[order.id].item_cost;
          } else {
            uniqueOrders[order.id].items.push({
              name: order.order_item,
              cots: order.item_cost
            });
          }
        }
        for (const order in uniqueOrders) {
          formattedOutput.push(uniqueOrders[order]);
        }

        res.json(formattedOutput);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.put("/orders/:id", (req, res) => {
    // This will take an order ID and change the information in the database based on keys present in the object the user sends.
    // { time_change: [] }

    const request = req.body;
    console.log(req.body);

    if (request.hasOwnProperty('orderStatus')) {
      switch (request.orderStatus) {
      case 'confirm':
        db.query(`
          UPDATE orders
            SET time_confirmed = NOW()
            SET time_estimate = $2
          WHERE id = $1;
        `, [req.params.id, req.body.estimate])
          .then(() => {
            res.json({ status: 'success' });
          });
        break;
      case 'deny':
        db.query(`
          UPDATE orders
            SET time_confirmed = infinity
            SET time_complete = infinity
          WHERE id = $1;
        `), [req.params.id]
          .then(() => {
            res.json({ status: 'success' });
          });
        break;
      case 'cancel':
        db.query(`
          UPDATE orders
            SET time_complete = infinity
          WHERE id = $1;
        `, [req.params.id])
          .then(() => {
            res.json({ status: 'success' });
          });
        break;
      case 'complete':
        db.query(`
          UPDATE orders
            SET time_complete = NOW()
          WHERE id = $1
        `, [req.params.id])
          .then(() => {
            res.json({ status: 'success' });
          });
      }
    }
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
    // Will modify this at some point to confirm the user
    // signing in is actually restaurant staff.
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

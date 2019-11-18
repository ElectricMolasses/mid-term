/*
 * All routes for Restaurants are defined here
 * Since this file is loaded in server.js into api/restaurants,
 *   these routes are mounted onto /restaurants
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const path = require('path');
const moment = require('moment');

module.exports = (db, twilio) => {
  router.get("/test", (req, res) => {
    res.sendFile(path.resolve('./views/restaurant/test.html'));
  });

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

  router.put("/orders/", (req, res) => {

    const request = req.body;

    if (request.hasOwnProperty('orderStatus')) {
      switch (request.orderStatus) {
      case 'confirm':
        console.log(request.time_estimate);
        db.query(`
          UPDATE orders
            SET time_confirmed = NOW(),
            time_estimate = $2
          WHERE id = $1;
        `, [request.orderId, request.time_estimate])
          .then(() => {
            res.json({ status: 'success' });
            twilio.messages.create({
              body: `Your order has been confirmed.
                    It should be ready in ${moment(request.time_estimate).fromNow()}`,
              to: `+19023945393`,
              from: `+12029029010`
            })
              .then((mes) => {
                console.log(mes.sid);
              });
          });
        break;
      case 'deny':
        db.query(`
          UPDATE orders
            SET time_confirmed = 'infinity',
            time_complete = 'infinity'
          WHERE id = $1;
        `, [request.orderId])
          .then(() => {
            res.json({ status: 'success' });
            res.json({ status: 'success' });
            twilio.messages.create({
              body: `Your order has been declined.`,
              to: `+19023945393`,
              from: `+12029029010`
            })
              .then((mes) => {
                console.log(mes.sid);
              });
          });
        break;
      case 'cancel':
        db.query(`
          UPDATE orders
            SET time_complete = infinity
          WHERE id = $1;
        `, [request.orderId])
          .then(() => {
            res.json({ status: 'success' });
          });
        break;
      case 'estimate':
        db.query(`
          UPDATE orders
            SET time_estimate = $2
          WHERE id = $1;
        `, [request.orderId, request.estimate])
          .then(() => {
            res.json({ status: 'success' });
            twilio.messages.create({
              body: `The restaurant has changed the estimated time of completion on your order.
                    The new estimate time is TEMPORARY TEXT`,
              to: `+19023945393`,
              from: `+12029029010`
            })
              .then((mes) => {
                console.log(mes.sid);
              });
          });
        break;
      case 'complete':
        db.query(`
          UPDATE orders
            SET time_complete = NOW()
          WHERE id = $1
        `, [request.orderId])
          .then(() => {
            res.json({ status: 'success' });
            twilio.messages.create({
              body: `Your order has been complete and is ready for pick up!`,
              to: `+19023945393`,
              from: `+12029029010`
            })
              .then((mes) => {
                console.log(mes.sid);
              });
          });
      }
    }
  });
  // twilio.messages.create({
  //   body: 'test message',
  //   to: '+19023945393',
  //   from: '+12029029010'
  // })
  //   .then((mes) => {
  //     console.log(mes.sid);
  //   });

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

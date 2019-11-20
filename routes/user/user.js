/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const path = require('path');

module.exports = (db, twilio) => {
  router.get("/", (req, res) => {
    console.log(req.data);
    //test cookies
    req.session
    res.sendFile(path.resolve('./views/user/user.html'));
  }),

  router.get("/menu", (req, res) => {
    return db.query(`
      SELECT menu_categories.name AS menu_category, items.name, description, cost
      FROM restaurants
        JOIN menu_categories ON (restaurant_id = restaurants.id)
        JOIN items ON (menu_id = menu_categories.id)
      WHERE restaurants.id = 1
      ORDER BY menu_categories.id;
    `)
      .then(query => {
        console.log(query.rows);
        res.json(query.rows);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/profile", (req, res) => {
    if (!req.session.userToken) {
      res.send(401);
    }
    // id will have to be change to userToken later.
    return db.query(`
      SELECT first_name, last_name, email, phone_number
      FROM users
      WHERE user_token = $1;
    `, [req.session.userToken])
      .then(query => {
        console.log((query.rows[0]));
        res.json(query.rows[0]);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message});
      });
  });

  router.post("/update", (req, res) => {
    const order = req.body.order;
    console.log('body', req.body);
    console.log('orderId', order)
    return db.query(`
    SELECT time_estimate
    FROM orders
    WHERE id = $1;
    `, [order])
      .then((query) => {
        res.json(query.rows[0]);
        // console.log(res.json(query.rows[0]));
        console.log(query.rows[0]);
      });
      
  });

  router.post("/login", (req, res) => {

    if (req.body.email && req.body.password) {
      return db.query(`
        SELECT user_token
        FROM users
        WHERE email = $1
          AND password = $2;
      `, [req.body.email.trim(), req.body.password.trim()])
        .then(query => {
          req.session.userToken = query.rows[0].user_token;
          res.send({ success: "Logged in" });
          console.log(res.send({ success: "Logged in" }));
        })
        .catch(err => {
          res.send({ error: err.message });
        });
    }
    // Still need to implement bcrypt.
  });

  router.post("/logout", (req, res) => {
    // It is what it is.
    req.session = null;
    res.redirect("/");
  });

  router.post("/signup", (req, res) => {
    // Register a new user (STRETCH)
  });

  router.post("/order", (req, res) => {
    // Submit information to create an order and notify the restaurant.
    // Just going to submit order immediately without checking for
    // payment or anything initially.
    const userId = req.session.userToken;
    const orderItems = req.body.items;
    let phone_number;
    const promises = [];
    return db.query(`
    INSERT INTO orders (
      customer_id,
      restaurant_id,
      time_placed
    ) VALUES (
      (SELECT id
        FROM users
        WHERE user_token = $1),
      1,
      NOW()
    )
    RETURNING id;
    `, [userId])
      .then(query => {
        const orderId = query.rows[0].id;
        
        
        for (const item of orderItems) {
          console.log(item);
          db.query(`
          INSERT INTO order_items (
            order_id, item_id
          ) VALUES (
            $1, (SELECT id FROM items WHERE name = $2)
          );
          `, [orderId, item])
            .then(query => {
              res.json(orderId);
              return query.rows;
            })
            .catch(err => {
              console.log({ error: err.message });
            });
        }
        db.query(`
        SELECT phone_number
        FROM users
        WHERE user_token = $1;
        `, [userId])
          .then(query => {
            phone_number = query.rows[0].phone_number;
          }).then(() => {
            Promise.all(promises)
              .then((query) => {
                console.log('THE QUERY', query);
                res.send('Restaurant is confirming your order');
                // Bother twilio to send an SMS here.
                twilio.messages.create({
                  body: 'A new order has been requested.',
                  to: phone_number,
                  from: '+12029029010'
                })
                  .then((mes) => {
                    console.log(mes.sid);
                  });
              });
          });
        
      })
      .catch(err => {
        console.log(err.message);
        res.sendStatus(500);
      });
  });

  return router;
};

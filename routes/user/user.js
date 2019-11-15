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
    //res.sendFile('/views/user/user.html', { root: '../../' });
    res.sendFile(path.resolve('./views/user/user.html'));
    // Needs to check for a users cookie, and treat
    // them as signed in if it exists.
    // Confirmed twilio working when passed into user routes.
    // twilio.messages.create({
    //   body: 'test message',
    //   to: '+19023945393',
    //   from: '+12029029010'
    // })
    //   .then((mes) => {
    //     console.log(mes.sid);
    //   });
  }),

  router.get("/menu", (req, res) => {
    return db.query(`
      SELECT menu_categories.name, items.name, description, cost
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
        res.json(query.rows[0]);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message});
      });
  });

  router.get("/update", (req, res) => {
    // Will be sent repeatedly while an order is active to keep the client updated.
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

    return db.query(`
    INSERT INTO orders (
      customer_id,
      restaurant_id,
      time_placed
    ) VALUES (
      $1,
      1,
      NOW()
    )
    RETURNING id;
    `, [userId])
      .then(query => {
        const orderId = query.rows[0].id;
        const requests = [];
        for (const item of orderItems) {
          console.log(item);
          requests.push(db.query(`
            INSERT INTO order_items (
              order_id, item_id
            ) VALUES (
              $1, $2
            )
            RETURNING *
          `, [orderId, item])
            .then(res => {
              return res.rows;
            }));
        }

        Promise.all(requests)
          .then((query) => {
            console.log('THE QUERY', query);
            res.send('Restaurant is confirming your order');
            // Bother twilio to send an SMS here.
          });
      })
      .catch(err => {
        console.log(err.message);
        res.sendStatus(500);
      });
  });

  return router;
};

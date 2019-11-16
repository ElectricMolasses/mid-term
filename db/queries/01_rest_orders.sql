-- {
--   name: (Customer first name and last initial),
--   phone: (Customer phone number),
--   items: [],
--   status: (pending, confirmed, complete, cancelled),
--   time_placed: (time the customer placed the order),
--   time_estimate: (current running estimate that the restaurant has stated)
-- }

SELECT CONCAT(users.first_name, ' ', 
          INITCAP(LEFT(users.last_name, 1))),
       users.phone_number, orders.id,
       items.name, items.cost, time_placed, time_confirmed, time_complete
FROM restaurants
  JOIN orders ON (restaurant_id = restaurants.id)
  JOIN users ON (customer_id = users.id)
  JOIN order_items ON (order_id = orders.id)
  JOIN items ON (item_id = items.id);
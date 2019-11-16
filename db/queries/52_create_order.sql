INSERT INTO orders (
  customer_id,
  restaurant_id,
  time_placed
) VALUES (
  1,
  1,
  NOW()
)
RETURNING id;

INSERT INTO order_items (
  order_id, item_id
) VALUES (
  2, 42
), (
  2, 20
), (
  2, 16
), (
  2, 31
);
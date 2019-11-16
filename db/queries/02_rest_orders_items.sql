-- returns all items on an order, with their individual costs
-- and quantities of each.

SELECT items.name, items.cost, COUNT(items)
FROM orders
  JOIN order_items ON (order_id = orders.id)
  JOIN items ON (item_id = items.id)
WHERE orders.id = 2
GROUP BY items.id;
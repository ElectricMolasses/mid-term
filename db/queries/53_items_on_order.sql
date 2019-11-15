SELECT items.name AS name, items.cost AS cost, COUNT(items) AS quantity
FROM orders
  JOIN order_items ON (order_id = orders.id)
  JOIN items ON (item_id = items.id)
WHERE orders.id = $1
GROUP BY items.name, items.cost;
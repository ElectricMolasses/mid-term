INSERT INTO order_items (
  order_id, item_id
) VALUES (
  6, (SELECT id FROM items WHERE name = 'Crispy Wontons (10 pcs)')
)
RETURNING *;
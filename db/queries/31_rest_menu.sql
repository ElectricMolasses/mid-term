SELECT menu_categories.name, items.name, description, cost
FROM restaurants
  JOIN menu_categories ON (restaurant_id = restaurants.id)
  JOIN items ON (menu_id = menu_categories.id)
WHERE restaurants.id = 1;
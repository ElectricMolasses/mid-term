DROP TABLE IF EXISTS staff CASCADE;

CREATE TABLE staff (
  id SERIAL PRIMARY KEY NOT NULL,
  restaurant_id INTEGER REFERENCES restaurants(id),
  user_id INTEGER REFERENCES users(id)
);
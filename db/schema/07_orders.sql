DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  time_placed TIMESTAMPTZ NOT NULL,
  time_confirmed TIMESTAMPTZ,
  time_complete TIMESTAMPTZ,
  time_estimate TIMESTAMPTZ
);
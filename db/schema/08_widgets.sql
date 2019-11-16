-- Drop and recreate Widgets table (Example)

-- DROP TABLE IF EXISTS widgets CASCADE;
-- CREATE TABLE widgets (
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   name VARCHAR(255) NOT NULL
-- );

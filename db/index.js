const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

module.exports = (dbParams) => {
  const db = new Pool(dbParams);

  db.query = (text, params) => {
    const start = Date.now();
    return pool.query(text, params)
      .then(res => {

        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
      })
      .catch(err => {
        console.log(err);
      });
  };

  db.connect();

  return db;
};
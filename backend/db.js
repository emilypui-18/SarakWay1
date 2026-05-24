const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '172.20.10.2',
  user: 'root',
  password: '',
  database: 'SarakWay_Database',
  port: 3307
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to SarakWay Database on port 3307');
});

module.exports = db;
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "10.244.107.80",
  user: "root",
  password: "",
  database: "SarakWay_Database",
  port: 3307
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  console.log("✅ Connected to AWS RDS MySQL Database");
});

module.exports = pool.promise();
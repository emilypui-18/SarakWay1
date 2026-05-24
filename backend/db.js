const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "sarakway-database.cnywtutq8hur.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "sarakwayadmin",
  database: "SarakWay_Database",
  port: 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {

  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
    return;
  }

  console.log("✅ Connected to AWS RDS MySQL Database");

  connection.release();
});

module.exports = pool.promise();
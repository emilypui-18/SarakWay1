const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "sarakway-database.cnywtutq8hur.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "sarakwayadmin",
  database: "SarakWay_Database",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
    return;
  }

  console.log("✅ Connected to AWS RDS MySQL Database");
});

module.exports = db;
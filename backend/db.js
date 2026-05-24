const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "SarakWay_Database",
  port: 3307
});

db.connect((err) => {

  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
    return;
  }

  console.log("✅ Connected to MySQL Database");
});

module.exports = db;
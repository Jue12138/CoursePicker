const pgp = require("pg-promise")();

// Replace these values with your database connection details
const connection = {
  host: "localhost",
  port: 5432,
  database: "Course Picker",
  user: "postgres",
  password: "vera630505",
};

const db = pgp(connection);

module.exports = db;

const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  database: "researchers",
  password: "muslera45",
  port: 5432,
});

module.exports = client;

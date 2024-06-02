// for local environment
require("dotenv").config({ path: ".env.local" });

const express = require("express");
const dbConn = require("./db/conn");

// routes
const homeRoutes = require("./routes/homeRoutes");

const app = express();

app.use(express.json());

app.use("", homeRoutes);

const port = parseInt(process.env.PORT ?? "3000");
dbConn
  .sync()
  .then(() => app.listen(port))
  .catch((err) => console.error("Error while trying to run the app", err));

// for local environment
require("dotenv").config({ path: ".env.local" });

const express = require("express");
const dbConn = require("./db/conn");

// auth config
const passportConfig = require("./config/passport");

// routes
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const entryRoutes = require("./routes/entryRoutes");

const app = express();

app.use(express.json());

app.use(passportConfig.initialize());

app.use("", homeRoutes);
app.use("/auth", authRoutes);
app.use("/entries", entryRoutes);

const port = parseInt(process.env.PORT ?? "3000");
dbConn
  .sync()
  .then(() =>
    app.listen(port, () => console.log(`Server running on port ${port}`))
  )
  .catch((err) => console.error("Error while trying to run the app", err));

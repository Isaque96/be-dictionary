// for local environment
require("dotenv").config({ path: ".env.local" });

// db connection and for table right association
const syncModels = require("./config/db/syncModels");

const express = require("express");

// middlewares
const errorHandler = require("./middlewares/errorMiddleware");
const exceptionHandler = require("./middlewares/exceptionMiddleware");

// auth config
const passportConfig = require("./config/passport");

// routes
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const entryRoutes = require("./routes/entryRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(errorHandler);
app.use(exceptionHandler);
app.use(passportConfig.initialize());

app.use("", homeRoutes);
app.use("/auth", authRoutes);
app.use("/entries", entryRoutes);
app.use("/user", userRoutes);

const port = parseInt(process.env.PORT ?? "3000");
syncModels()
  .then(() =>
    app.listen(port, () => console.log(`Server running on port ${port}`))
  )
  .catch((err) => console.error("db error", err));

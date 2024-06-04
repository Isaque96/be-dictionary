require("dotenv").config({ path: ".env.local" });
const User = require("../models/user");

User.sync();

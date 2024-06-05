const routes = require("express").Router();
const EntryController = require("../controllers/EntryController");
const authInfo = require("../middlewares/authMiddleware");

routes.get("/:language", authInfo, EntryController.paginatedWords);

module.exports = routes;

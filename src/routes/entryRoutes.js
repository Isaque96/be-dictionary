const routes = require("express").Router();
const EntryController = require("../controllers/EntryController");

routes.get("/:language", EntryController.paginatedWords);

module.exports = routes;

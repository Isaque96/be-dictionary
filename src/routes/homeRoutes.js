const routes = require("express").Router();
const HomeController = require("../controllers/HomeController");

routes.get("/", HomeController.home);

module.exports = routes;

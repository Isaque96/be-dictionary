const routes = require("express").Router();
const HomeController = require("../controllers/homeController");

routes.get("/", HomeController.home);

module.exports = routes;

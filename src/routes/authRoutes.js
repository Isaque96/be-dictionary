const routes = require("express").Router();
const AuthController = require("../controllers/authController");

routes.post("/signin", AuthController.signin);
routes.post("/signup", AuthController.signup);

module.exports = routes;

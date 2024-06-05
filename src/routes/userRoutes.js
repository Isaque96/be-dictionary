const routes = require("express").Router();
const UserController = require("../controllers/UserController");
const authInfo = require("../middlewares/authMiddleware");

routes.get("/me/history", authInfo, UserController.paginatedWordsHistory);
routes.get("/me", authInfo, UserController.me);

module.exports = routes;

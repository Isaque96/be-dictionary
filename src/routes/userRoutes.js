const routes = require("express").Router();
const UserController = require("../controllers/UserController");
const authInfo = require("../middlewares/authMiddleware");

routes.get("/me/history", authInfo, UserController.paginatedWordsHistory);
routes.get("/me", authInfo, UserController.me);
routes.get("/me/favorites", authInfo, UserController.paginatedFavoriteWords);

module.exports = routes;

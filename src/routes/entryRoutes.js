const routes = require("express").Router();
const EntryController = require("../controllers/EntryController");
const authInfo = require("../middlewares/authMiddleware");

routes.get("/:language", authInfo, EntryController.paginatedWords);
routes.get("/:language/:word", authInfo, EntryController.getWord);
routes.post(
  "/:language/:word/favorite",
  authInfo,
  EntryController.saveFavorite
);
routes.delete(
  "/:language/:word/unfavorite",
  authInfo,
  EntryController.removeFavorite
);

module.exports = routes;

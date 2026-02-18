const express = require("express");
const controller = require("../controllers/post.controller");
const multer = require("multer");
const identifyUser = require("../middlewares/auth.middleware");
const upload = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();
/*
* @routes
* @description
*/
postRouter.post(
  "/",
  upload.single("image"),
  identifyUser,
  controller.controllerCreatePost,
);

postRouter.get("/", identifyUser, controller.controllerGetPost);

postRouter.get(
  "/details/:postId",
  identifyUser,
  controller.controllerGetPostDetails,
);

postRouter.post("/like/:postId", identifyUser, controller.controllerLikePost)

module.exports = postRouter;

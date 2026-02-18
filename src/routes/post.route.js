const express = require("express");
const controller = require("../controllers/post.controller");
const multer = require("multer");
const identifyUser = require("../middlewares/auth.middleware");
const upload = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

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

module.exports = postRouter;

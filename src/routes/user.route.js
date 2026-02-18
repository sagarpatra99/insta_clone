const express = require("express");
const userRouter = express.Router();
const controller = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware");

userRouter.post(
  "/follow/:username",
  identifyUser,
  controller.controllerFollowUser,
);

userRouter.post(
  "/unfollow/:username",
  identifyUser,
  controller.controllerUnfollowUser,
);

module.exports = userRouter;

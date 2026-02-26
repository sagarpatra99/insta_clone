const express = require("express");
const authRouter = express.Router();
const controller = require("../controllers/auth.controller");
const identifyUser = require("../middlewares/auth.middleware");

authRouter.post("/register", controller.controllerRegister);

authRouter.post("/login", controller.controllerLogin);

authRouter.get("/get-me", identifyUser, controller.controllerGetMe);

module.exports = authRouter;

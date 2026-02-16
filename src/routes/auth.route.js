const express = require("express");
const authRouter = express.Router();
const controller = require("../controllers/auth.controller");

authRouter.post("/register", controller.controllerRegister);

authRouter.post("/login", controller.controllerLogin);

module.exports = authRouter;

const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const controllerRegister = async (req, res) => {
  const { email, username, password, bio, profileImage } = req.body;

  const isUserExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExists)
    return res.status(409).json({
      message:
        "User already exisis" + isUserExists.email === email
          ? "Email already exists"
          : "Username already exists",
    });

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username: username,
    email: email,
    password: hash,
    bio: bio,
    profileImage: profileImage,
  });

  const token = jwt.sign(
    {
      // - user ka data hona chahiye
      // - data unique hona chahiye
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("Token", token);

  res.status(201).json({
    message: "User Registerd Successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
};

const controllerLogin = async (req, res) => {
  const { username, email, password } = req.body;

  const isValidUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!isValidUser)
    return res.status(404).json({
      message: "User not found",
    });

  const isValidPassword = bcrypt.compare(password, isValidUser.password);

  if (!isValidPassword)
    return res.status(404).json({
      message: "Invalid User Credential!",
    });

  const token = jwt.sign(
    {
      id: isValidUser._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User LoggedIn Successfully",
    User: {
      username: isValidUser.username,
      email: isValidUser.email,
      bio: isValidUser.bio,
      profileImage: isValidUser.profileImage,
    },
  });
};

module.exports = { controllerRegister, controllerLogin };

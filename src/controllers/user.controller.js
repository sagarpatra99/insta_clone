const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

const controllerFollowUser = async (req, res) => {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  if (followeeUsername == followerUsername) {
    return res.status(409).json({
      message: "You cannot follow yourself!",
    });
  }

  const isFolloweeExists = await userModel.findOne({
    username: followeeUsername,
  });

  if (!isFolloweeExists) {
    return res.status(404).json({
      message: "User which you are trying to follow does not exists",
    });
  }

  const isAlreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (isAlreadyFollowing) {
    return res.status(409).json({
      message: `You are already following ${followeeUsername}`,
      follow: isAlreadyFollowing,
    });
  }

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(201).json({
    message: `You are now following ${followeeUsername}`,
    follow: followRecord,
  });
};

const controllerUnfollowUser = async (req, res) => {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isUserFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (!isUserFollowing) {
    return res.status(409).json({
      message: `You are not Following ${followeeUsername}`,
    });
  }

  await followModel.findByIdAndDelete(isUserFollowing._id);

  res.status(201).json({
    message: `You have unfollowed ${followeeUsername}`,
  });
};

module.exports = { controllerFollowUser, controllerUnfollowUser };

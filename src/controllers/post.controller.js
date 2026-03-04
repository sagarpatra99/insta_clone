const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
// const jwt = require("jsonwebtoken");
const postModel = require("../models/post.model");
const likeModel = require("../models/like.model");

const imagekit = new ImageKit({
  // publicKey: "public_0HrIXYJVq1IozSKGgznZ4STQgAY=",
  privateKey: "private_ALe4oAin7ulFRdE2OJpOehIHjjo=",
  // urlEndpoint: "https://ik.imagekit.io/xduzsey1j",
});

// POST - /api/posts  [protected] - token required
const controllerCreatePost = async (req, res) => {
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "cohort-2-insta_clone",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post Created Successfully",
    post,
  });
};

// GET - /api/posts  [protected] - token required
const controllerGetPost = async (req, res) => {
  const userId = req.user.id;

  const posts = await postModel.find({
    user: userId,
  });

  res.status(201).json({
    message: "Posts fetched successfully!",
    posts,
  });
};

// GET - /api/posts/
const controllerGetPostDetails = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content.",
    });
  }

  res.status(201).json({
    message: "Post fetched Successfully",
    post,
  });
};

const controllerLikePost = async (req, res) => {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(409).json({
      message: "Post not found",
    });
  }

  const like = await likeModel.create({
    post: postId,
    user: username,
  });

  res.status(201).json({
    message: "Post liked successfully!",
    like,
  });
};

const controllerUnlikePost = async (req, res) => {
  const postId = req.params.postId;
  const username = req.user.username;

  const isLiked = await likeModel.findOne({
    post: postId,
    user: username,
  });

  if (!isLiked)
    return res.status(401).json({
      message: "Post didn't like",
    });

  await likeModel.findOneAndDelete({ _id: isLiked._id });

  return res.status(201).json({
    message: "Post unliked successfully.",
  });
};

const controllerGetFeed = async (req, res) => {
  const user = req.user;

  const posts = await Promise.all(
    (await postModel.find().sort({ _id: -1 }).populate("user").lean()).map(
      async (post) => {
        const isLiked = await likeModel.findOne({
          user: user.username,
          post: post._id,
        });

        post.isLiked = !!isLiked;

        return post;
      },
    ),
  );

  res.status(201).json({
    message: "posts feched successfully.",
    posts,
  });
};

module.exports = {
  controllerCreatePost,
  controllerGetPost,
  controllerGetPostDetails,
  controllerLikePost,
  controllerUnlikePost,
  controllerGetFeed,
};

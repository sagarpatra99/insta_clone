const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
// const jwt = require("jsonwebtoken");
const postModel = require("../models/post.model");

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

module.exports = {
  controllerCreatePost,
  controllerGetPost,
  controllerGetPostDetails,
};

const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Post = require("../models/Post");

const postController = {};

// 1. Authenticated user can make a post (POST a post)
postController.createPost = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { image, content } = req.body;
  let post = await Post.create({ author: currentUserId, image, content });

  return sendResponse(res, 200, true, post, null, "create post sucessfully");
});
// 2. Author can update post by post's id
postController.updateOwnPost = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { postId } = req.params;
  let post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(404, "Post not found", "Update Post error");
  }
  if (!post.author.equals(currentUserId)) {
    throw new AppError(
      401,
      "Unauthorized edit other's post",
      "Update Post error"
    );
  }
  const allows = ["content", "image"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });
  post = await post.save();
  return sendResponse(res, 200, true, post, null, "update post sucessfully");
});
// 3. Author can delete post by post's id
postController.deleteOwnPost = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { postId } = req.params;
  let post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(404, "Post not found", "Update Post error");
  }
  if (!post.author.equals(currentUserId)) {
    throw new AppError(
      401,
      "Unauthorized edit other's post",
      "Update Post error"
    );
  }
  post.isDeleted = true;
  post = await post.save();

  return sendResponse(res, 200, true, {}, null, "delete post sucessfully");
});
// 4. Friend can see list of friend's post
postController.getFriendPost = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const count = await Post.countDocuments({ isDeleted: false });
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const postList = await Post.find({ isDeleted: false })
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");
  return sendResponse(
    res,
    200,
    true,
    { postList, totalPage },
    null,
    "get post sucessfully"
  );
});

module.exports = postController;

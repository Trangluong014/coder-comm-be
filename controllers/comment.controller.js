const { catchAsync, sendResponse } = require("../helpers/utils");
const Comment = require("../models/Comment");

const commentController = {};

// Friend can make a comment (POST a comment) to other friend's post
commentController.makeComment = catchAsync(async (res, req, next) => {
  const { currentUserId } = req;
  const { postId } = req.params;
  const { content } = req.body;
  let comment = await Comment.create({
    author: currentUserId,
    post: postId,
    content,
  });
  return sendResponse(res, 200, true, comment, null, "make comment success");
});
// Friend can see a list of all comment belong to friend's post
commentController.listComment = catchAsync(async (res, req, next) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const count = await Comment.countDocuments({ isDeleted: false });
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const commentList = await Comment.find({ isDeleted: false })
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");
  return sendResponse(
    res,
    200,
    true,
    commentList,
    null,
    "get comment list success"
  );
});
// Author of Comment can update that comment
commentController.updateComment = catchAsync(async (res, req, next) => {
  const { currentUserId } = req;
  const { postId } = req.params;
  const { commentId } = req.params;
  let comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  if (!comment) {
    throw new AppError(404, "Comment not found", "Update Comment error");
  }
  if (!comment.author.equals(currentUserId)) {
    throw new AppError(
      401,
      "Unauthorized edit other's comment",
      "Update Comment error"
    );
  }
  const allows = ["content"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      comment[field] = req.body[field];
    }
  });
  comment = await comment.save();
  return sendResponse(res, 200, true, comment, null, "update comment success");
});
// Author of Comment can delete that comment
commentController.deleteComment = catchAsync(async (res, req, next) => {
  const { currentUserId } = req;
  const { postId } = req.params;
  const { commentId } = req.params;
  let comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  if (!comment) {
    throw new AppError(404, "Comment not found", "Delete comment error");
  }
  if (!comment.author.equals(currentUserId)) {
    throw new AppError(
      401,
      "Unauthorized delete other's comment",
      "Delete error"
    );
  }
  comment.isDeleted = true;
  comment = await comment.save();

  return sendResponse(res, 200, true, comment, null, "delete success");
});

module.exports = commentController;

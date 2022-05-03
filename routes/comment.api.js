const express = require("express");
const {
  makeComment,
  listComment,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");
const { loginRequired } = require("../middlewares/authentication");
const router = express.Router();

// Friend can make a comment (POST a comment) to other friend's post
router.post("/post/:postId/comments", loginRequired, makeComment);
// Friend can see a list of all comment belong to friend's post
router.get("/comments", loginRequired, listComment);
// Author of Comment can update that comment
router.put("/post/:postId/comments/:commentId", loginRequired, updateComment);
// Author of Comment can delete that comment
router.delete(
  "/post/:postId/comments/:commentId",
  loginRequired,
  deleteComment
);

module.exports = router;

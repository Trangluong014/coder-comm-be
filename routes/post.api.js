const express = require("express");
const {
  createPost,
  updateOwnPost,
  deleteOwnPost,
  getFriendPost,
} = require("../controllers/post.controller");
const { loginRequired } = require("../middlewares/authentication");
const router = express.Router();

/**
 * @method: POST/posts
 * @description: Create new post
 * @access: Login require
 */
router.post("/create", loginRequired, createPost);

/**
 * @method: POST/posts
 * @description: Create new post
 * @access: Login require
 */
router.put("/:postId", loginRequired, updateOwnPost);

/**
 * @method: POST/posts
 * @description: Create new post
 * @access: Login require
 */
router.delete("/:postId", loginRequired, deleteOwnPost);

/**
 * @method: POST/posts
 * @description: Create new post
 * @access: Login require
 */
router.get("/", loginRequired, getFriendPost);
module.exports = router;

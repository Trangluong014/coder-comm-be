const express = require("express");
const router = express.Router();

/* GET home page. */
const userRoutes = require("./users.api.js");
router.use("/users", userRoutes);

const postRoutes = require("./post.api");
router.use("/posts", postRoutes);

const friendRoutes = require("./friend.api");
router.use("/friends", friendRoutes);

const commentRoutes = require("./comment.api");
router.use("/comments", commentRoutes);

const reactionRoutes = require("./reaction.api");
router.use("/reactions", reactionRoutes);

module.exports = router;

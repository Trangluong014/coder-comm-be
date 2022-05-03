const express = require("express");
const router = express.Router();

/* GET home page. */
const userRoutes = require("./users.api.js");
router.use("/users", userRoutes);

const postRoutes = require("./post.api");
router.use("/posts", postRoutes);

const friendRoutes = require("./friend.api");
router.use("/friends", friendRoutes);

module.exports = router;

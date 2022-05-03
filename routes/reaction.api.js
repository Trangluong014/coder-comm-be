const express = require("express");
const { makeReaction } = require("../controllers/reaction.controller");
const { loginRequired } = require("../middlewares/authentication");
const router = express.Router();

// Friend can make a reaction (like, dislike) to each other post
router.post("/reactions", loginRequired, makeReaction);
module.exports = router;

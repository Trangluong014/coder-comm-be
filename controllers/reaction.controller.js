const { catchAsync, sendResponse } = require("../helpers/utils");
const Reaction = require("../models/Reaction");

const reactionController = {};

reactionController.makeReaction = catchAsync(async (res, req, next) => {
  const { currentUserId } = req;
  const { postId } = req.params;
  const { content } = req.body;
  let reaction = await Reaction.create({
    author: currentUserId,
    post: postId,
    content,
  });
  sendResponse(res, 200, true, reaction, "make reaction success");
});

module.exports = reactionController;

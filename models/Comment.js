const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Users",
    },
    post: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Posts",
    },

    content: { type: String, require: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamp: true }
);

const Comment = mongoose.model("Comments", commentSchema);
module.exports = Comment;

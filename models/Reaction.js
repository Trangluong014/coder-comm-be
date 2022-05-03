const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = Schema(
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

const Reaction = mongoose.model("Reactions", reactionSchema);
module.exports = Reaction;

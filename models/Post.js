const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Users",
    },

    content: { type: String, require: true },
    image: { type: String, require: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamp: true }
);

const Post = mongoose.model("Posts", postSchema);
module.exports = Post;

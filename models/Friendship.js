const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = Schema(
  {
    from: { type: Schema.Types.ObjectId, require: true, ref: "Users" }, //Requestor
    to: { type: Schema.Types.ObjectId, require: true, ref: "Users" }, //Receiver
    status: { type: String, enum: ["pending", "accepted", "declined"] },
  },
  { timestamp: true }
);

const Friend = mongoose.model("Friend", friendSchema);
module.exports = Friend;

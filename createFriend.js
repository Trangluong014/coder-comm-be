const Friend = require("./models/Friendship");
const User = require("./models/User");

const createFriend = async () => {
  const users = await User.find({ isDeleted: false });
  const status = ["pending", "accepted", "declined"];
  const success = await Promise.all(
    users.map(async ({ _id }) => {
      if (users[0]._id !== _id) {
        return await Friend.create({
          from: _id,
          to: users[0]._id,
          status: status[Math.floor(Math.random() * 3)],
        });
      } else {
        return `self`;
      }
    })
  );
  console.log("success");
};

module.exports = createFriend;

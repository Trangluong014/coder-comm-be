const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Friend = require("../models/Friendship");
const User = require("../models/User");

const friendController = {};

// 1. Authenticated user can make friend request to other

friendController.makeFriendRequest = catchAsync(async (req, res, next) => {
  const requestorId = req.currentUserId;
  const receiverId = req.body.to;
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new AppError(404, "User not found", "Make friend request error");
  }

  let friendShip = await Friend.findOne({
    $or: [
      {
        from: requestorId,
        to: receiverId,
      },
      { from: receiverId, to: requestorId },
    ],
  });

  if (!friendShip) {
    friendShip = await Friend.create({
      from: requestorId,
      to: receiverId,
      status: "pending",
    });
  } else {
    switch (friendShip.status) {
      case "pending":
        if (friendShip.to.equals(requestorId)) {
          throw new AppError(
            400,
            "You have all ready sent a request to this user",
            "Make friend request error"
          );
        } else {
          throw new AppError(
            400,
            "You have all ready received a request from this user",
            "Make friend request error"
          );
        }
      case "accepted":
        throw new AppError(
          400,
          "You and this user are already friend",
          "Make friend request error"
        );
      case "declined":
        (friendShip.from = requestorId),
          (friendShip.to = receiverId),
          (friendShip.status = "pending");
        await friendShip.save();
        return sendResponse(
          res,
          200,
          true,
          friendShip,
          null,
          "Request has been sent"
        );

      default:
        throw new AppError(
          400,
          "friendship status is undefined",
          "make friend request error"
        );
    }
  }
  return sendResponse(
    res,
    200,
    true,
    friendShip,
    null,
    "make friend request sucessfully"
  );
});

// 2. Authenticated user can see list of friend

friendController.listOfFriend = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  let friendList = await Friend.find({
    $or: [{ from: currentUserId }, { to: currentUserId }],
    status: "accepted",
  });

  let friendIDs = friendList.map(({ from, to }) => {
    if (from.equals(currentUserId)) return to;
    return from;
  });
  const filterCondition = [{ isDeleted: false, _id: { $in: friendIDs } }];
  const allow = ["name", "email"];
  allow.forEach((field) => {
    if (filter[field] !== undefined) {
      filterCondition.push({
        [field]: { $regex: filter[field], $options: "i" },
      });
    }
  });
  const filterCriteria = filterCondition.length
    ? { $and: filterCondition }
    : {};

  // console.log(filterCondition);

  const count = await User.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  let userList = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  // console.log("list", friendList);
  // console.log("id", friendIDs);
  return sendResponse(
    res,
    200,
    true,
    { userList, totalPage },
    null,
    "sucessfully"
  );
});
// 3. Authenticated user can accept or reject a friend request
friendController.responseToRequest = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { status } = req.body;
  const { requestorId } = req.params;

  let friendship = await Friend.findOne({
    to: currentUserId,
    from: requestorId,
    status: "pending",
  });

  if (!friendship) {
    throw new AppError(
      400,
      "Friend Request Not Found",
      "response to friend request error"
    );
  } else {
    friendship.status = status;
    await friendship.save();
  }

  return sendResponse(res, 200, true, friendship, null, "sucessfully");
});

// 4. Authenticated user can see a list of all request receive

friendController.listofReceive = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  let friendList = await Friend.find({
    to: currentUserId,
    status: "pending",
  });

  let friendIDs = friendList.map(({ from }) => {
    return from;
  });
  const filterCondition = [{ isDeleted: false, _id: { $in: friendIDs } }];
  const allow = ["name", "email"];
  allow.forEach((field) => {
    if (filter[field] !== undefined) {
      filterCondition.push({
        [field]: { $regex: filter[field], $options: "i" },
      });
    }
  });
  const filterCriteria = filterCondition.length
    ? { $and: filterCondition }
    : {};

  // console.log(filterCondition);

  const count = await User.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  let userList = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { userList, totalPage },
    null,
    "sucessfully"
  );
});

// 5. Author can see a list of all request sent

friendController.listofSent = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  let friendList = await Friend.find({
    from: currentUserId,
    status: "pending",
  });

  let friendIDs = friendList.map(({ to }) => {
    return to;
  });
  const filterCondition = [{ isDeleted: false, _id: { $in: friendIDs } }];
  const allow = ["name", "email"];
  allow.forEach((field) => {
    if (filter[field] !== undefined) {
      filterCondition.push({
        [field]: { $regex: filter[field], $options: "i" },
      });
    }
  });
  const filterCriteria = filterCondition.length
    ? { $and: filterCondition }
    : {};

  // console.log(filterCondition);

  const count = await User.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  let userList = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { userList, totalPage },
    null,
    "sucessfully"
  );
});
// 6. Author of Request can cancel the request

friendController.cancelRequest = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { receiverId } = req.body;
  const friendship = await Friend.findOneAndDelete({
    from: currentUserId,
    to: receiverId,
    status: "pending",
  });
  console.log("1", currentUserId, receiverId);
  console.log("friendship", friendship);
  if (!friendship) {
    throw new AppError(
      401,
      "Can not find friend request",
      "cancel request error"
    );
  }

  return sendResponse(res, 200, true, {}, null, "cancel sucessfully");
});
// 7. Friend can unfriend
friendController.unfriend = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const { receiverId } = req.params;

  const friendship = await Friend.findOneAndDelete({
    $or: [
      {
        from: currentUserId,
        to: receiverId,
        status: "accepted",
      },
      { from: receiverId, to: currentUserId, status: "accepted" },
    ],
  });
  if (!friendship) {
    throw new Error(401, "Can not find friendship", "Unfriend error");
  }

  return sendResponse(res, 200, true, {}, null, "Unfriend sucessfully");
});

module.exports = friendController;

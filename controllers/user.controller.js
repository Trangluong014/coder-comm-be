const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};

// 1. User can create account with email and password ✅

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password } = req.body;
  console.log(name, email, password);

  let user = await User.findOne({ email });

  if (user) {
    throw new AppError(409, "User already exits", "Register error");
  }

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  user = await User.create({ name, email, password });

  const accessToken = user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successfully"
  );
});

// 2. User can login with email and password ✅

userController.loginEmailPassword = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, "+password");

  if (!user) {
    throw new AppError(400, "User not found", "Login Error");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(400, "Invalid credentials", "Login Error");
  }

  const accessToken = user.generateToken();
  return sendResponse(
    res,
    200,
    { user, accessToken },
    null,
    "Login successful"
  );
});

// 3. User can see a list of all users ✅

userController.getAllUser = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterCondition = [{ isDeleted: false }];
  const allow = ["name", "email"];
  allow.forEach((field) => {
    if (filter[field] !== undefined) {
      filterCondition.push({
        [field]: { $regex: filter[field], $options: "i" },
      });
    }
  });

  // if (filter.name) {
  //   filterCondition.push({ name: filter.name }); //exact match
  // }
  // if (filter.email) {
  //   filterCondition.push({ email: filter.email }); //exact match
  // }
  // [{ isDeleted: false },{ name: filter.name }]
  const filterCriteria = filterCondition.length
    ? { $and: filterCondition }
    : { filterCondition };

  console.log(filterCondition);
  const count = await User.countDocuments(filterCriteria);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  let userList = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, true, { userList, totalPage }, null, "success");
});

// 4. User can see other user's information by id ✅

userController.getSingleUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, "User Not Found", "Get user by Id error");
  }

  return sendResponse(
    res,
    200,
    true,
    { user },
    null,
    "Get User by Id successfully"
  );
});

// 5. Owner can see own user's information ✅

userController.getCurrentUserProfile = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const user = await User.findById(currentUserId);
  if (!user) {
    throw new AppError(404, "User Not Found", "Get user by Id error");
  }

  return sendResponse(
    res,
    200,
    true,
    { user },
    null,
    "Get Current Profile successfully"
  );
});

// 6. Owner can update own account profile ✅

userController.updateCurrentUser = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const user = await User.findById(currentUserId);
  if (!user) {
    throw new AppError(404, "User Not Found", "Get user by Id error");
  }
  const allows = ["name", "city", "aboutMe"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "update Current Profile Success"
  );
});

// 7. Owner can deactivate own account ✅

userController.deactivateCurrentUser = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  //delete password confirm
  await User.findByIdAndUpdate(
    currentUserId,
    { isDeleted: true },
    { new: true }
  );
  return sendResponse(res, 200, true, {}, null, "Deactivate success");
});

// 8. Rocket Owner update password
// 9. Rocket Password confirm when update

module.exports = userController;

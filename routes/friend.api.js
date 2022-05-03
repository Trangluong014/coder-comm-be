const express = require("express");
const { body, param } = require("express-validator");
const {
  makeFriendRequest,
  listOfFriend,
  responseToRequest,
  listofReceive,
  listofSent,
  cancelRequest,
  unfriend,
} = require("../controllers/friend.controller");
const { loginRequired } = require("../middlewares/authentication");
const {
  validate,
  checkObjectId,
  statusValueCheck,
} = require("../middlewares/validator");
const router = express.Router();

// 1. Authenticated user can make friend request to other
router.post(
  "/requests",
  loginRequired,
  validate([body("to").exists().isString().custom(checkObjectId)]),
  makeFriendRequest
);
// 3. Authenticated user can accept or reject a friend request
router.put(
  "/requests/:receiverId",
  validate([
    param("receiverid").exists().isString().custom(checkObjectId),
    body("status").exists().isString().custom(statusValueCheck),
  ]),
  loginRequired,
  responseToRequest
);

// 2. Authenticated user can see list of friend
router.get("/me/all", loginRequired, listOfFriend);
// 4. Authenticated user can see a list of all request receive
router.get("/requests/incoming", loginRequired, listofReceive);
// 5. Author can see a list of all request sent
router.get("/requests/outgoing", loginRequired, listofSent);

// 6. Author of Request can cancel the request
router.delete("/requests/cancel", loginRequired, cancelRequest);
// 7. Friend can unfriend
router.delete(
  "/unfriend/:receiverId",
  validate([param("receiverId").exists().isString().custom(checkObjectId)]),
  loginRequired,
  unfriend
);

module.exports = router;

const express = require("express");
const {
  createUserByEmailPassword,
  register,
  loginEmailPassword,
  getAllUser,
  getSingleUserById,
  getCurrentUserProfile,
  updateCurrentUser,
  deactivateCurrentUser,
} = require("../controllers/user.controller");
const { loginRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const { body, param, header } = require("express-validator");
const router = express.Router();

/**
 * @method: POST
 * @access: Public
 * @description: Create new user document in User collection
 * @constructor: req.body {Userscheme}
 */

router.post(
  "/register",
  validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  register
);

/**
 * @description:
 * @access:
 * @method:
 * @param:
 */
router.post(
  "/login",
  validate([
    body("email,Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  loginEmailPassword
);
/**
 * @description:
 * @access:
 * @method:
 * @param:
 */
router.get("/all", getAllUser);
/**
 * @description:
 * @access:
 * @method:
 * @param:
 */
router.get(
  "/:id",
  validate([param("id").exists().isString().custom(checkObjectId)]),
  getSingleUserById
);
/**
 * @description:
 * @access:
 * @method:
 * @param:
 */
router.get(
  "/me/get",
  validate([header("authorixation").exists().isString()]),
  loginRequired,
  getCurrentUserProfile
);
/**
 * @description:
 * @access:
 * @method:
 * @param:
 */
router.put("/me/update", loginRequired, updateCurrentUser);
/**
 * @description:
 * @access:
 * @method:
 * @param:
 */
router.delete("/me/deactivate", loginRequired, deactivateCurrentUser);

module.exports = router;

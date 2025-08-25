const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/users", userController.users);
router.get("/me", authMiddleware, userController.me);
router.patch("/updateprofile", authMiddleware, userController.updateProfile);
router.put(
  "/updateAddress/:addressId",
  authMiddleware,
  userController.updateAddress
);

module.exports = router;

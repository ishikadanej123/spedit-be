const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/users", authMiddleware, isAdmin, userController.users);
router.post("/google-login", userController.googleLogin);
router.get("/me", authMiddleware, userController.me);
router.patch("/updateprofile", authMiddleware, userController.updateProfile);
router.put(
  "/updateAddress/:addressId",
  authMiddleware,
  userController.updateAddress
);

module.exports = router;

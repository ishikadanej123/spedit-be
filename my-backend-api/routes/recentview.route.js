const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const RecentViewController = require("../controllers/recentview.controller");

router.post("/add", authMiddleware, RecentViewController.addRecentView);

router.get("/get", authMiddleware, RecentViewController.getRecentViews);
router.delete("/delete", authMiddleware, RecentViewController.cleanArray);

module.exports = router;

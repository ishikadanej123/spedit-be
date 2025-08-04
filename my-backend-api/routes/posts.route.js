const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  return res.status(200).json([
    { id: 1, title: "First Post", content: "Hello World" },
    { id: 2, title: "Second Post", content: "Another one" },
  ]);
});

module.exports = router;

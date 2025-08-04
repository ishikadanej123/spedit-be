const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const postroutes = require("./routes/posts.route");

app.use(cors());
app.use(express.json());
console.log("PORT from env:", process.env.PORT);

app.get("/", async (req, res) => {
  console.log("GET / called");
  res.status(200).send("hello world");
});

app.use("/api/posts", postroutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authroutes = require("./routes/auth.route");
const PORT = process.env.APP_PORT || 4000;
app.use(cors());
app.use(express.json());
console.log("PORT from env:", process.env.DB_PORT);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", async (req, res) => {
  console.log("GET / called");
  res.status(200).send("hello world");
});

app.use("/", authroutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

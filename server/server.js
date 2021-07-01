const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "dist", "connect4web")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "connect4web", "index.html"));
});

app.listen("8888", () => console.log("Running"));

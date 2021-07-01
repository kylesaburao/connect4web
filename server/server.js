const express = require("express");
const path = require("path");
const app = express();

const PORT = 8888;

app.use(express.static(path.join(__dirname, "dist", "connect4web")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "connect4web", "index.html"));
});

app.listen(`${PORT}`, () => console.log("Running"));

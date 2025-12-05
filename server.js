import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "OFFIL ROME Proxy is running" });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

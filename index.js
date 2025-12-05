import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/proxy", async (req, res) => {
  try {
    const { url, method = "POST", headers = {}, body } = req.body;

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => null);

    res.status(response.status).json({
      ok: response.ok,
      status: response.status,
      data,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failure", details: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("OFFIL API Proxy V2 is running");
});

app.listen(8080, () => console.log("Proxy running on port 8080"));

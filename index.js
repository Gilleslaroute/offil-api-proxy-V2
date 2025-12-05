import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const FT_API_URL = "https://api.pole-emploi.io/partenaire/rome/v1";
const CLIENT_ID = process.env.FT_CLIENT_ID;
const CLIENT_SECRET = process.env.FT_CLIENT_SECRET;

async function getToken() {
  const res = await fetch("https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=/partenaire", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: "application_" + CLIENT_ID + " api_romev1"
    })
  });
  return res.json();
}

app.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const tokenData = await getToken();
    const token = tokenData.access_token;

    const response = await fetch(`${FT_API_URL}/search?q=${encodeURIComponent(q)}`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("OFFIL API PROXY — OK");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Proxy OFFIL running on port " + port));


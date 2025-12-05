import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const FT_API_URL = "https://api.pole-emploi.io/partenaire/rome/v1";
const CLIENT_ID = process.env.FT_CLIENT_ID;
const CLIENT_SECRET = process.env.FT_CLIENT_SECRET;

/* -----------------------------
   1. TOKEN POLE EMPLOI
----------------------------- */
async function getToken() {
  const res = await fetch(
    "https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=/partenaire",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: `application_${CLIENT_ID} api_romev1`
      })
    }
  );

  if (!res.ok) {
    console.error("Erreur OAuth PE:", await res.text());
    throw new Error("Impossible d'obtenir un token Pôle Emploi");
  }

  return res.json();
}

/* -----------------------------
   2. ROME SEARCH PROXY
----------------------------- */
app.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Paramètre q manquant" });

    const tokenData = await getToken();
    const token = tokenData.access_token;

    const response = await fetch(
      `${FT_API_URL}/search?q=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      console.error("Erreur API ROME:", await response.text());
      throw new Error("Erreur API ROME");
    }

    res.json(await response.json());
  } catch (err) {
    console.error("Erreur /search:", err);
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   3. HEALTHCHECK
----------------------------- */
app.get("/", (req, res) => res.send("OFFIL API PROXY — OK"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

/* -----------------------------
   4. LISTEN
----------------------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on port " + PORT));

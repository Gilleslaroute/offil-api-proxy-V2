import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Nouveau endpoint France Travail ROMEO v2
const FT_API_URL = "https://api.francetravail.io/romeo/v2";

const CLIENT_ID = process.env.FT_CLIENT_ID;
const CLIENT_SECRET = process.env.FT_CLIENT_SECRET;

// Récupération token OAuth2 FT
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
        scope: "application_" + CLIENT_ID + " api_romev2"  // 🔥 Nouveau scope si nécessaire
      })
    }
  );

  return res.json();
}

// Route de recherche
app.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const tokenData = await getToken();
    const token = tokenData.access_token;

    // 🔥 Nouvelle route ROMEO v2 pour recherche de métiers/appellations
    const response = await fetch(
      `${FT_API_URL}/appellations?texte=${encodeURIComponent(q)}`,
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Erreur FT:", err);
    res.status(500).json({ error: err.message });
  }
});

// Route racine
app.get("/", (req, res) => {
  res.send("OFFIL API PROXY — OK (ROMEO v2)");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


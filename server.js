require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("MongoDB Connection Error ❌", err));


const UrlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
});
const Url = mongoose.model("Url", UrlSchema);


app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: "URL is required" });

  const shortUrl = shortid.generate();
  const newUrl = new Url({ originalUrl, shortUrl });
  await newUrl.save();

  res.json({ originalUrl, shortUrl });
});


app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const foundUrl = await Url.findOne({ shortUrl });
  if (foundUrl) {
    res.redirect(foundUrl.originalUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

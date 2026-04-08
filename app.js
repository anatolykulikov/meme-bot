const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const MEMES_DIR = path.join(__dirname, "memes");
const REMEMBER_DIR = path.join(__dirname, "remember");

if (!fs.existsSync(REMEMBER_DIR)) {
  fs.mkdirSync(REMEMBER_DIR);
}

app.use("/memes", express.static(MEMES_DIR));

function loadMemes() {
  return fs.readdirSync(MEMES_DIR)
    .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f))
    .map(f => `/memes/${f}`);
}

let memes = loadMemes();

function getToday() {
  return new Date().toLocaleDateString("ru-RU"); // YYYY-MM-DD
}

function generateMeme(userId) {
  const seed = userId + getToday();
  const hash = crypto.createHash("md5").update(seed).digest("hex");
  const num = parseInt(hash.substring(0, 8), 16);
  return memes[num % memes.length];
}

function getUserFile(userId) {
  return path.join(REMEMBER_DIR, `${userId}.json`);
}

function getOrCreateMeme(userId) {
  const filePath = getUserFile(userId);
  const today = getToday();

  // если файл есть
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      if (data.date === today && data.meme) {
        return data.meme;
      }
    } catch (e) {
      console.log("битый JSON, пересоздаём", userId);
    }
  }

  // создаём новый
  const meme = generateMeme(userId);

  fs.writeFileSync(filePath, JSON.stringify({
    date: today,
    meme: meme
  }, null, 2));

  return meme;
}

app.post("/mem", (req, res) => {
  const userId = req.body.user_id || "anon";

  if (memes.length === 0) {
    return res.json({
      response_type: "ephemeral",
      text: "Нет мемов 😢",
    });
  }

  const memePath = getOrCreateMeme(userId);

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  res.json({
    response_type: "ephemeral",
    text: "Твой мем дня:",
    attachments: [
      {
        image_url: baseUrl + memePath,
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
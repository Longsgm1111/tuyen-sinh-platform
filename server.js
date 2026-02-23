const express = require("express");
const session = require("express-session");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

/* ================= SECURITY ================= */
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET=Thuphuong33p93799SDyeuLong,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI=mongodb+srv://longsgm1111:Thuuphuong33p93799SD@cluster0.pgn2htr.mongodb.net/?appName=Cluster0)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const DataSchema = new mongoose.Schema({
  tabs: Object
});

const Data = mongoose.model("Data", DataSchema);

/* ================= ADMIN ================= */
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS_HASH = $2b$10$sVwjXL2Jx7fP5LigjqowG.jIPaf3oE7cjHxuDMyg5kqPKPXduyi/W;

/* ================= ROUTES ================= */

app.get("/data", async (req, res) => {
  let data = await Data.findOne();
  if (!data) {
    data = await Data.create({
      tabs: {
        "Giới thiệu": [],
        "Chỉ tiêu": [],
        "Chuyên ngành": [],
        "Xét tuyển": [],
        "Quyền lợi": [],
        "Hình ảnh tham khảo": []
      }
    });
  }
  res.json(data);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER) {
    return res.status(401).json({ success: false });
  }

  const match = await bcrypt.compare(password, ADMIN_PASS_HASH);
  if (!match) {
    return res.status(401).json({ success: false });
  }

  req.session.user = username;
  res.json({ success: true });
});

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login.html");
  next();
}

app.post("/update", requireLogin, async (req, res) => {
  await Data.findOneAndUpdate({}, req.body, { upsert: true });
  res.json({ success: true });
});

app.get("/admin", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
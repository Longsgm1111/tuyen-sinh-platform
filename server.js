const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "long_secret_key",
  resave: false,
  saveUninitialized: true
}));

// ===== Admin Account =====
const ADMIN = {
  username: "admin",
  password: "123456"
};

// ===== Database file =====
const DB_FILE = path.join(__dirname, "database.json");

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ===== API lấy data =====
app.get("/data", (req, res) => {
  res.json(readDB());
});

// ===== Login =====
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN.username && password === ADMIN.password) {
    req.session.user = username;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ===== Middleware bảo vệ admin =====
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  next();
}

// ===== Admin page =====
app.get("/admin", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});

// ===== Update database =====
app.post("/update", requireLogin, (req, res) => {
  writeDB(req.body);
  res.json({ success: true });
});

// ===== Logout =====
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// ===== Static files (LUÔN để cuối) =====
app.use(express.static("public"));

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
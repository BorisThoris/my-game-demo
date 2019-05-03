// index.js
import path from "path";
import express from "express";
import exphbs from "express-handlebars";
import request from "request-promise";

const app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, "index.html");

app.use(express.static(DIST_DIR));

app.get("*", (req, res) => {
  res.sendFile(HTML_FILE);
});

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views/layouts")
  })
);

// app.set("view engine", ".hbs");
// app.set("views", path.join(__dirname, "views"));
// app.set("scripts", path.join(__dirname, "scripts"));
// app.set("assets", path.join(__dirname, "assets"));

// app.get("/", (request, response) => {
//   console.log(HTML_FILE);
//   console.log(template);
//   console.log(":)");
// });

// app.get("/phaser.js", function(req, res, next) {
//   console.log("phaser.js delivered");
//   res.sendFile(path.resolve(__dirname, "./scripts/phaser.js"));
// });

// app.get("/Scene1.js", function(req, res, next) {
//   console.log("scene1.js delivered");
//   res.sendFile(path.resolve(__dirname, "./scripts/Scene1.js"));
// });

// app.get("/Game.js", function(req, res, next) {
//   console.log("game.js delivered");
//   res.sendFile(path.resolve(__dirname, "./scripts/Game.js"));
// });

// app.get("/runningMan.png", function(req, res, next) {
//   console.log("runningMan.png delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/runningMan.png"));
// });

// app.get("/runningMan2.png", function(req, res, next) {
//   console.log("runningMan2.png delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/runningMan2.png"));
// });

// app.get("/runningMan.json", function(req, res, next) {
//   console.log("runningMan.json delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/runningMan.json"));
// });

// app.get("/flexingMan.png", function(req, res, next) {
//   console.log("flexingMan.png delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/flexingMan.png"));
// });

// app.get("/jumpingMan.png", function(req, res, next) {
//   console.log("jumpingMan.png delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/jumpingMan.png"));
// });

// app.get("/background.png", function(req, res, next) {
//   console.log("background.png delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/background.png"));
// });

// app.get("/floor.png", function(req, res, next) {
//   console.log("floor.png delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/floor.png"));
// });

// app.get("/Ball.js", function(req, res, next) {
//   console.log("Ball.js delivered");
//   res.sendFile(path.resolve(__dirname, "./scripts/Ball.js"));
// });

// ///spikeball.png
// app.get("/spikeball.png", function(req, res, next) {
//   console.log("Ball.js delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/spikeball.png"));
// });
// ///replay.png

// app.get("/replay.png", function(req, res, next) {
//   console.log("ReplayButton delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/replayBtn.png"));
// });

// app.get("/backgroundMusic.mp3", function(req, res, next) {
//   console.log("backgroundMusic delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/backMusic(2).mp3"));
// });

// app.get("/ooGnome.mp3", function(req, res, next) {
//   console.log("ooGnome delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/oo.mp3"));
// });

// app.get("/gameOver.mp3", function(req, res, next) {
//   console.log("GameOver sound delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/gameOver.mp3"));
// });

// app.get("/croutching-flex.png", function(req, res, next) {
//   console.log("croutching-flex delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/croutching-flex.png"));
// });

// app.get("/croutching-walk-left.png", function(req, res, next) {
//   console.log("croutching-walk-left delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/croutching-walk-left.png"));
// });

// app.get("/croutching-walk-right.png", function(req, res, next) {
//   console.log("croutching-walk-left delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/croutching-walk-right.png"));
// });

// app.get("/powerUp.png", function(req, res, next) {
//   console.log("croutching-walk-left delivered");
//   res.sendFile(path.resolve(__dirname, "./assets/powerUp.png"));
// });

app.listen(80);

console.log(`Listening to PORT: 80`);

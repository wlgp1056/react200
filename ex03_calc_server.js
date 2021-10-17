const http = require("http");
const express = require("express");
const app = express();
// npm i cors -S
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  console.log("GET - / 요청 들어 옴...");
  res.end("<h1>Hello world! Nodejs server ...</h1>");
});

app.get("/plus/:a/:b", (req, res) => {
  let result = Number(req.params.a) + Number(req.params.b);
  res.end(String(result));
});
app.get("/minus/:a/:b", (req, res) => {
  let result = Number(req.params.a) - Number(req.params.b);
  res.end(String(result));
});

app.get("/mult/:a/:b", (req, res) => {
  let result = Number(req.params.a) * Number(req.params.b);
  res.end(String(result));
});
app.get("/div/:a/:b", (req, res) => {
  let result = Number(req.params.a) / Number(req.params.b);
  res.end(String(result));
});

const server = http.createServer(app);
server.listen(8880, () => {
  console.log("계산기 서버 실행 중 ... http://localhost:8880");
});
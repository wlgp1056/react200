const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

let db = null;
const dbConnection = (dbUrl, dbName) => {
  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    console.log("mongodb 연결 성공...", dbUrl, dbName);
  });
};

app.use(cors());
// body-parser 미들웨어 등록
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log("GET - / 요청 들어 옴...");
  res.end("<h1>Hello world! Nodejs server ...</h1>");
});

const sendList = (req, res) => {
  let users = db.collection("users");
  users.find({}).toArray((err, arr) => {
    if (err) throw err;
    for (var i = 0; i < arr.length; i++) {
      arr[i].no = i + 1;
    } // end of for
    console.log("뷰로 목록 보내기...");
    res.send(arr); // 1
  });
};

app.get("/list", (req, res) => {
  console.log("GET - /list 요청 들어 옴...");
  sendList(req, res);
  //res.send(memberList); // end()나 send()를 호출하면 request가 종료된다.
});

app.post("/input", (req, res) => {
  console.log("POST - /input 요청 들어 옴...");
  let inputData = {
    name: req.body.name,
    message: req.body.message,
  };
  let users = db.collection("users");
  users.insertMany([inputData], (err, result) => {
    if (err) throw err;
    if (result.insertedCount > 0) {
      console.log("데이터 추가 성공!");
    } else {
      console.log("추가된 데이터 없슴!");
    }
    // 목록을 React에 전송한다.
    sendList(req, res);
  });
});

app.post("/update", (req, res) => {
  console.log("POST - /update 요청 들어 옴...");
  let member = {
    name: req.body.name,
    message: req.body.message,
  };
  console.log("member => ", member);
  let users = db.collection("users");
  var myquery = { _id: ObjectId(req.body._id) };
  var newvalues = { $set: member };
  users.updateOne(myquery, newvalues, function (err, result) {
    if (err) throw err;
    console.log("------------1:",result.modifiedCount);
    if (result.modifiedCount == 1) {
    } else {
      console.log("수정 실패!");
    }
    sendList(req, res);
  });
});

app.post("/delete", (req, res) => {
  let deleteQuery = {
    _id: ObjectId(req.body._id),
  };
  db.collection("users").deleteOne(deleteQuery, function (err, obj) {
    if (err) throw err;
    console.log("------------2:",obj.deletedCount);
    if (obj.deletedCount == 1) {
    } else {
      console.log("삭제 실패!");
    }
    sendList(req, res);
  });
});

// 서버 생성 및 실행
const server = http.createServer(app);
server.listen(5500, () => {
  console.log("run on server ... http://localhost:5500");
  dbConnection("mongodb://localhost", "local");
});
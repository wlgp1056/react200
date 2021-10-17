//서버준비
const express = require("express");
const http = require("http");
const app = express();
//cors
const cors = require("cors");

//파일업로드-multer미들웨어
const multer = require("multer"); //파일을 서버에 등록
const fs = require('fs'); //내장객체 따로 설치 필요 없음- 파일입출력//nodejs 크롤링?  

//쿠키, 세션
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

//static 미들웨어 
const static =require("serve-static");
//path설정
const path = require("path");
app.use("/uploads", static(path.join(__dirname, "uploads"))); //현재 디렉토리, 폴더를 url처럼 만들어줌 

//쿠키세션 사용
app.use(cookieParser());
app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true,
}));

//멀터 미들웨어 사용
let storage = multer.diskStorage({
    destination: function(req, file, callback){
    callback(null, "uploads");
  },
  filename: function(req, file, callback){
    callback(null, Date.now()+"_"+file.originalname); //혹은 uuid 모듈..
  },
});
let upload = multer({
  storage: storage,
  limits:{
    files: 10, //파일개수
    filesize: 1024* 1024* 1024 //파일 크기
  }
});
//
//라우터-파일업로드
const route =express.Router();

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
// const cookieParser = require("cookie-parser");
const { triggerAsyncId } = require("async_hooks");

//db전역사용
let db = null;
//db연결
const dbConnection = (dbUrl, dbName) => {
  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    console.log("mongodb 연결 성공...", dbUrl, dbName);
  });
};
//cors정책
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
    console.dir(req.originalUrl);

        res.send(arr);
    
  });
};
const sendList2 = (req, res) => {
  let users = db.collection("users");
  users.find({}).toArray((err, arr) => {
    if (err) throw err;
    for (var i = 0; i < arr.length; i++) {
      arr[i].no = i + 1;
    } // end of for

    res.end(JSON.stringify(arr));
  });
};
app.route("/list").get( (req, res) => {
  console.log("GET - /list 요청 들어 옴...");
  sendList(req, res);
  //res.send(memberList); // end()나 send()를 호출하면 request가 종료된다.
});

app.route("/input").post((req, res) => {
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

app.route("/update").post((req, res) => {
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
    console.log(result);
    if (result.modifiedCount == 1) {
    } else {
      console.log("수정 실패!");
    }
    sendList(req, res);
  });
});

app.route("/delete").post((req, res) => {
  let deleteQuery = {
    _id: ObjectId(req.body._id),
  };
  db.collection("users").deleteOne(deleteQuery, function (err, obj) {
    if (err) throw err;
    console.log(obj);
    if (obj.deletedCount == 1) { //delete가 되었을때 deltedCount ==1
    } else {
      console.log("삭제 실패!");
    }
    sendList(req, res);
  });
});

app.route("/photo_upload").post(upload.array("photo",1),(req,res)=>{//포토라는 이름으로 1개의 파일
  console.log("post-upload요청 들어옴")
  try {
    var files = req.files;

    console.dir("#===== 업로드된 첫번째 파일 정보 =====#");
    console.dir(req.files[0]);
    console.dir("#=====#");

    // 현재의 파일 정보를 저장할 변수 선언
    var originalname = "",
      filename = "",
      mimetype = "",
      size = 0;

    if (Array.isArray(files)) {
      // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
      console.log("배열에 들어있는 파일 갯수 : %d", files.length);

      for (var index = 0; index < files.length; index++) {
        originalname = files[index].originalname;
        filename = files[index].filename;
        mimetype = files[index].mimetype;
        size = files[index].size;
      } // end of  for
    } else {
      // else  부분 계속 이어서 작성 ....
      // 배열에 들어가 있지 않은 경우 (현재 설정에서는 해당 없음)
      console.log("파일 갯수 : 1 ");

      originalname = files[index].originalname;
      filename = files[index].name;
      mimetype = files[index].mimetype;
      size = files[index].size;
    } // end  of  if~else

    console.log(
      "현재 파일 정보 : " +
        originalname +
        ", " +
        filename +
        ", " +
        mimetype +
        ", " +
        size
    );

    // 클라이언트에 응답 전송
    res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
    res.write("<h3>파일 업로드 성공</h3>");
    res.write("<hr/>");
    res.write(
      "<p>원본 파일명 : " +
        originalname +
        " -> 저장 파일명 : <a href='http://localhost:5500/uploads/"+filename+"'>" +
        filename +
        "</a></p> 이미지 : <img src='http://localhost:5500/uploads/" + 
        filename +
        "'/>"
    );

    res.write("<p>MIME TYPE : " + mimetype + "</p>");
    res.write("<p>파일 크기 : " + size + "</p>");
    res.end("success!");
  } catch (err) {
    console.dir(err.stack);
    res.end("fail!");
  } // end of try~catch

});


app.get("/search",(req,res)=>{
  console.log("검색")
  let member = {
    name: req.body.name,
    message: req.body.message,
  };

    var mysort = { name: req.body.name  };
    db.collection("customers").find().sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
    sendList(req, res);
});
// ajax버전
app.route("/photo_upload_ajax").post(upload.array("photo", 1), (req, res) => {
  console.log("POST - /photo_upload 요청 들어 옴 ...");
  console.log(req.body.name);
  try {
    var files = req.files;

    console.dir("#===== 업로드된 첫번째 파일 정보 =====#");
    console.dir(req.files[0]);
    console.dir("#=====#");

    // 현재의 파일 정보를 저장할 변수 선언
    var originalname = "",
      filename = "",
      mimetype = "",
      size = 0;

    if (Array.isArray(files)) {
      // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
      console.log("배열에 들어있는 파일 갯수 : %d", files.length);

      for (var index = 0; index < files.length; index++) {
        originalname = files[index].originalname;
        filename = files[index].filename;
        mimetype = files[index].mimetype;
        size = files[index].size;
      } // end of  for
    } else {
      // else  부분 계속 이어서 작성 ....
      // 배열에 들어가 있지 않은 경우 (현재 설정에서는 해당 없음)
      console.log("파일 갯수 : 1 ");

      originalname = files[index].originalname;
      filename = files[index].name;
      mimetype = files[index].mimetype;
      size = files[index].size;
    } // end  of  if~else
    //DB에 넣기
    let users = db.collection("users");
    let inputData2={
      name:req.body.name,
      message: req.body.message,
      filename: filename
  };
  
  users.insertMany([inputData2], (err, result) => {
    if (err) throw err;
    if (result.insertedCount > 0) {
      console.log("데이터 추가 성공!");
    } else {
      console.log("추가된 데이터 없슴!");
    }
    // 목록을 React에 전송한다.
  
  });
  
    console.log(
      "현재 파일 정보 : " +
        originalname +
        ", " +
        filename +
        ", " +
        mimetype +
        ", " +
        size
    );

    //res.write("<p>MIME TYPE : " + mimetype + "</p>");
    //res.write("<p>파일 크기 : " + size + "</p>");
    let uploadResultObj = {
      result:"success",
      originalname : originalname,
      filename : filename,
      downloadUrl : 'http://localhost:5500/uploads/'+filename,
      mimetype : mimetype,
      size : size
    };
    //res.send(uploadResultObj); //end는 문자열로 보내야됨 제이슨을 스트링화 
    sendList2(req, res);
  } catch (err) {
    console.dir(err.stack);
    //res.send({result:"fail"});
    sendList2(req, res);
  } // end of try~catch
  
});

// 서버 생성 및 실행
const server = http.createServer(app);
server.listen(5500, () => {
  console.log("run on server ... http://localhost:5500");
  dbConnection("mongodb://localhost", "local");
});

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");

var Message = mongoose.model("Mesage", {
  name: String,
  message: String,
});

mongoose.connect(
  "MONGODB_URL_HERE",
  { useNewUrlParser: true },
  (err) => {
    console.log("Databse connected-----", err);
  }
);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/messages", (req, res) => {
    Message.find({},(err,messages)=>{
        res.send(messages);
    })
  
});

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err) {
      sendStatus(500);
    }
    io.emit("message", req.body);
    res.sendStatus(200);
  });
});

io.on("connection", (socket) => {
  console.log("A new user added");
});

var server = http.listen(3000, () => {
  console.log("Server is running on port ", server.address().port);
});

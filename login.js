var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");

//Connect to the DB

var connection = mysql.createConnection({
  host: "107.180.56.84",
  user: "josephjlee",
  password: "Tyler123@",
  database: "JimmyV3",
});

// Express App handling http requests
var app = express();

app.use(
  session({
    secret: "hashingsessions",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Display login.html to a Client

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname + "/login.html"));
});

// Client enters the details in the form and clicks the submit button

app.post("/auth", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect("/home");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

// Handle re-routing to the home page

app.get("/home", function (request, response) {
  if (request.session.loggedin) {
    response.send("Welcome back, " + request.session.username + "!");
  } else {
    response.send("Please login to view this page!");
  }
  response.end();
});
app.listen();
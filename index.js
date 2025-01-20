const express = require("express");


const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening at 3000"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

app.post("/gameData", (request, response) => {
  const data = request.body;

  var rec_gameData = data.gameData;
  //Check if ID Exists
  var cookie_id = data.cookie_id;

  let responseData = {};
});

app.post("/gameDataLevel", (request, response) => {
  const data = request.body;
  var rec_gameData = data.gameData;
  var cookie_id = data.cookie_id;
});

app.post("/surveyData", (request, response) => {
  const data = request.body;
  var rec_surveyData = data.surveyData;
  //Check if ID Exists
  var cookie_id = data.cookie_id;
});

app.post("/createCookie", (request, response) => {
  first = request.body.first
  var query = {};
  var firstTerm = "user_index";
  query[firstTerm];
});

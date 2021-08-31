const express = require("express");

const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://admin:123@cluster0.u4ohv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
  database.find({ cookie_id }, (err, data_query) => {
    //ID Exists Update Number of time Played
    if (data_query.length == 1) {
      var newTimesPlayed = data_query[0].game_played_num + 1;
      var newGameData = data_query[0].gameData;

      var game_name = "game-" + newTimesPlayed;
      newGameData[game_name] = rec_gameData;

      database.update(
        { cookie_id: cookie_id },
        { $set: { game_played_num: newTimesPlayed } }
      );
      database.update(
        { cookie_id: cookie_id },
        { $set: { gameData: newGameData } }
      );
      responseData = {
        num_times_played: newTimesPlayed,
        gameData: newGameData,
      };
      response.json(responseData);
    } else {
      console.log("error w db", "finding cookie id:", cookie_id);
      response.json(responseData);
    }
  });
});

app.post("/gameDataLevel", (request, response) => {
  const data = request.body;
  var rec_gameData = data.gameData;
  var cookie_id = data.cookie_id;
  database.update(
    { cookie_id: cookie_id },
    { $set: { gameData: rec_gameData } }
  );
  response.json("Success");
});

app.post("/surveyData", (request, response) => {
  const data = request.body;

  var rec_surveyData = data.surveyData;
  //Check if ID Exists
  var cookie_id = data.cookie_id;
  database.find({ cookie_id }, (err, data_query) => {
    //ID Exists Update Number of time Played
    if (data_query.length == 1) {
      var newTimesPlayed = data_query[0].survey_played_num + 1;
      var newSurveyData = data_query[0].surveyData;

      var survey_name = "survey-" + newTimesPlayed;
      newSurveyData[survey_name] = rec_surveyData;

      database.update(
        { cookie_id: cookie_id },
        { $set: { survey_played_num: newTimesPlayed } }
      );
      database.update(
        { cookie_id: cookie_id },
        { $set: { surveyData: newSurveyData } }
      );
    } else {
      console.log("error w db", data_query.length);
    }
  });
  response.json("Success");
});

app.post("/createCookie", (request, response) => {
  var query = {};
  var firstTerm = "user_index";
  query[firstTerm];

  //Find cookie_id in MongoDB
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("error", err);
      return
    }
    var dbo = db.db("mydb");

    dbo.collection("user-index").findOne(query, function (err, result) {
      if (err) {
        console.log("error", err);
        return
      }

      //Returns current user index up next
      let cookieId = result["user-index"];
      console.log(cookieId);
      var newvalues = { $set: { "user-index": cookieId + 1 } };

      //Update user index + 1 in MongoDB
      dbo
        .collection("user-index")
        .updateOne(query, newvalues, function (err, res) {
          if (err) {
            console.log("error", err);
            return
          } else {
            console.log("1 document updated");
          }

          //Create new user in MongoDB
          newUser = {};
          newUser.cookie_id = cookieId;
          newUser.game_played_num = 0;
          newUser.survey_played_num = 0;
          newUser.gameData = {};
          newUser.surveyData = {};

          dbo.collection("users").insertOne(newUser, function (err, res) {
            if (err){
              console.log("error", err);
              return
            }
            //console.log("new user created", newUser);
            db.close();

            //Send Response back to client saying cookie and user created in db
            let responseData = { cookie_id: cookieId };
            response.json(responseData);
          });
        });
    });
  });
});

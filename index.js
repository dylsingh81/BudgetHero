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

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("error", err);
      return;
    }
    var dbo = db.db("mydb");

    //Find information to use for update
    dbo.collection("users").findOne({ cookie_id }, function (err, result) {
      if (err) {
        console.log("error", err);
        return;
      }

      var newTimesPlayed = result.game_played_num + 1;
      var newGameData = result.gameData;

      var game_name = "game-" + newTimesPlayed;
      newGameData[game_name] = rec_gameData;

      //Update Number of time Played
      dbo
        .collection("users")
        .updateOne(
          { cookie_id: cookie_id },
          { $set: { game_played_num: newTimesPlayed } },
          function (err, res) {
            if (err) {
              console.log("error", err);
              return;
            } else {
              console.log("Updated user", cookie_id, "times played");
            }
          }
        );

      //Update Game Data
      dbo
        .collection("users")
        .updateOne(
          { cookie_id: cookie_id },
          { $set: { gameData: newGameData } },
          function (err, res) {
            if (err) {
              console.log("error", err);
              return;
            } else {
              console.log("Updated user", cookie_id, "game data");
            }
            db.close();
          }
        );

      responseData = {
        num_times_played: newTimesPlayed,
        gameData: newGameData,
      };
      response.json(responseData);
    });
  });
});

app.post("/gameDataLevel", (request, response) => {
  const data = request.body;
  var rec_gameData = data.gameData;
  var cookie_id = data.cookie_id;

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("error", err);
      return;
    }
    var dbo = db.db("mydb");

    //Update Number of time Played
    dbo
      .collection("users")
      .updateOne(
        { cookie_id: cookie_id },
        { $set: { gameData: rec_gameData } },
        function (err, res) {
          if (err) {
            console.log("error", err);
            return;
          } else {
            console.log("Updated game" , cookie_id, "level data");
          }
          db.close()
        }
      );
  });

  response.json("Success");
});

app.post("/surveyData", (request, response) => {
  const data = request.body;

  var rec_surveyData = data.surveyData;
  //Check if ID Exists
  var cookie_id = data.cookie_id;

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("error", err);
      return;
    }
    var dbo = db.db("mydb");

    //Find information to use for update
    dbo.collection("users").findOne({ cookie_id }, function (err, result) {
      if (err) {
        console.log("error", err);
        return;
      }

      var newTimesPlayed = result.survey_played_num + 1;
      var newSurveyData = result.surveyData;

      var survey_name = "survey-" + newTimesPlayed;
      newSurveyData[survey_name] = rec_surveyData;

      //Update Number of time Played
      dbo
        .collection("users")
        .updateOne(
          { cookie_id: cookie_id },
          { $set: { survey_played_num: newTimesPlayed } },
          function (err, res) {
            if (err) {
              console.log("error", err);
              return;
            } else {
              console.log("Updated", cookie_id, "user times survey");
            }
          }
        );

      //Update Survey Data
      dbo
        .collection("users")
        .updateOne(
          { cookie_id: cookie_id },
          { $set: { surveyData: newSurveyData } },
          function (err, res) {
            if (err) {
              console.log("error", err);
              return;
            } else {
              console.log("Updated", cookie_id, "user survey data");
            }
            db.close();
          }
        );
    });
  });
  response.json("Success");
});

app.post("/createCookie", (request, response) => {
  first = request.body.first
  var query = {};
  var firstTerm = "user_index";
  query[firstTerm];

  //Find cookie_id in MongoDB
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("error", err);
      return;
    }
    var dbo = db.db("mydb");

    dbo.collection("user-index").findOne(query, function (err, result) {
      if (err) {
        console.log("error", err);
        return;
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
            return;
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
          newUser.first = first;

          dbo.collection("users").insertOne(newUser, function (err, res) {
            if (err) {
              console.log("error", err);
              return;
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

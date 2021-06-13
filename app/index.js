const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');

first = false
if(first){
  let data = {
    "user_index": 0
  }
  database.insert(data)
}

database.loadDatabase(function (err) {    // Callback is optional
   console.log("Database loaded")
   console.log(database.getAllData())
});


app.post('/ip', (request, response) => {
    const data = request.body;

    //Check if IP Exists
    var ip = data.ip
    var gameData = undefined
    database.find({ip}, (err, data_query) => {
        //IP Exists Update Number of time Played
        if(data_query.length == 1){
          newTimesPlayed = data_query[0].num_times_played+1
          database.update({ ip: ip }, { $set: { num_times_played: newTimesPlayed} })
          gameData = data_query[0].gameData
        }
        //Else Create IP
        else{
            if(data_query.length >1){
              console.log("DB ERROR?")
            }
            data.num_times_played = 1
            data.num_survey_times_played = 1
            
            data.surveyData = {}
            database.insert(data);
            newTimesPlayed = 1
        }
            
      responseData = {
        num_times_played: newTimesPlayed,
        gameData: gameData
      }
      //console.log(responseData)
      response.json(responseData);
    })

});


app.post('/gameData', (request, response) => {
  const data = request.body;
  //Check if IP Exists
  var ip = data.ip
  var newGameData = data.gameData
  database.find({ip}, (err, data_query) => {
      //IP Exists Update Number of time Played
      if(data_query.length == 1){ 
        database.update({ ip: ip }, { $set: { gameData: newGameData} })
      }
      //Else Create IP
      else{
          console.log("Error - Logging IP without database entry")
      }
  })
  response.json("Success");
});

app.post('/surveyData', (request, response) => {
  const data = request.body;

  var rec_surveyData = data.surveyData
  //Check if ID Exists
  var cookie_id = data.cookie_id
  database.find({cookie_id}, (err, data_query) => {
      //ID Exists Update Number of time Played
      if(data_query.length == 1){
        
        var newTimesPlayed = data_query[0].survey_played_num+1
        var newSurveyData = data_query[0].surveyData
        
        var survey_name = "survey-" + newTimesPlayed
        newSurveyData[survey_name] = rec_surveyData
        
        database.update({ cookie_id: cookie_id }, { $set: { survey_played_num: newTimesPlayed} })
        database.update({ cookie_id: cookie_id }, { $set: { surveyData: newSurveyData} })
      }
      else{
        console.log("error w db")
      }
  })
  response.json("Success");
});


app.post('/createCookie', (request, response) => {

  var toFind = {};
  var firstTerm = "user_index";
  toFind[firstTerm];
  
  database.find(toFind, function(err, docs) {
    if(docs == []){
      console.log("DB Error - Should not happen ever")
    }
    let cookie_id = docs[0].user_index
    let responseData = {"cookie_id": cookie_id}
    
    database.update(toFind, { $set: { user_index: cookie_id+1} })
    
    newUser = {}
    newUser.cookie_id = cookie_id
    newUser.game_played_num = 0
    newUser.survey_played_num = 0
    newUser.gameData = {}       
    newUser.surveyData = {}
    database.insert(newUser);
    
    response.json(responseData);
  });
});


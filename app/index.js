const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.json');
database.loadDatabase(function (err) {    // Callback is optional
   console.log("Database loaded")
   console.log(database.getAllData())
});

/*
app.get('/api', (request, response) => {
    console.log("Here")
    database.find({}, (err, data) => {
      if (err) {
        response.end();
        return;
      }
      response.json(data);
    });
  });
*/
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
});

app.post('/surveyData', (request, response) => {
  const data = request.body;

  var rec_surveyData = data.surveyData
  //Check if IP Exists
  var ip = data.ip
  database.find({ip}, (err, data_query) => {
      //IP Exists Update Number of time Played
      if(data_query.length == 1){
        
        var newTimesPlayed = data_query[0].num_survey_times_played+1
        var newSurveyData = data_query[0].surveyData
        
        var survey_name = "survey-" + newTimesPlayed
        newSurveyData[survey_name] = rec_surveyData
        //console.log(newSurveyData, data_query[0])
        
        database.update({ ip: ip }, { $set: { num_survey_times_played: newTimesPlayed} })
        database.update({ ip: ip }, { $set: { surveyData: newSurveyData} })
      }
      //Else Create IP
      else{
          if(data_query.length >1){
            console.log("DB ERROR?")
          }
          data.num_times_played = 0
          data.num_survey_times_played = 1
          data.surveyData = {
            "survey-1": rec_surveyData
          }
          data.gameData = {}
          database.insert(data);
          newTimesPlayed = 1
      }
    /*
    responseData = {
      num_times_played: newTimesPlayed,
      gameData: gameData
    }
    //console.log(responseData)
    response.json(responseData);*/
  })
});



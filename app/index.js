const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase(function (err) {    // Callback is optional
   console.log("Database loaded")
   //console.log(database.getAllData())
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
    database.find({ip}, (err, data_query) => {
        //IP Exists Update Number of time Played
        if(data_query.length == 1){
          newTimesPlayed = data_query[0].num_times_played+1
          database.update({ ip: ip }, { $set: { num_times_played: newTimesPlayed} })
          
        }
        //Else Create IP
        else{
            if(data_query.length >1){
              console.log("DB ERROR?")
            }
            data.num_times_played = 1
            database.insert(data);
        }

    })
    //response.json(data);
});


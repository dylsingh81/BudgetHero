const express = require('express');
const Datastore = require('nedb');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();


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
        console.log(data_query)
        //IP Exists Update Number of time Played
        if(data_query.length != 0){
            console.log("One IP:" , data_query.length)
        }
        //Else Create IP
        else{
            console.log("Here")
            database.insert(data);
        }

    })
    //response.json(data);
});
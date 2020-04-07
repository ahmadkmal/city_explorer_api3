'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const superagent = require('superagent');
const PORT = process.env.PORT || 4000;
const app = express();
// make a connection to the psql using the provided link
const client = new pg.Client(process.env.DATABASE_URL);


client.on('error', (err) => {
  throw new Error(err);
});
// get data from the query and Insert it to the DB
app.use(cors());
app.use(express.static('./public'));
app.get('/location',locationHandeller);
app.get('/weather',weatherHandeler);

app.get('/trails',trailsHandeler);

var city ;
function locationHandeller(request,response) {
    // response.status(200).send
     city = request.query.city;
    //  var res = client.query(`SELECT * FROM data`);
    const SQL = `SELECT * FROM data WHERE name = '${city}' `;
    client
      .query(SQL)
      .then((results) => {
          if(results.rows.length){
            Location.current =results.rows[0].location;
            weatherHandeler();
            trailsHandeler();
            response.status(200).json(results.rows[0].location);
          }else{
            superagent(`https://eu1.locationiq.com/v1/search.php?key=${process.env.geoCode}&q=${city}&format=json`)
            .then((res) => {
              const geoData = res.body;
              const locationData = new Location(city, geoData);
              Location.current = locationData;
              weatherHandeler();
              trailsHandeler();
              response.status(200).json(locationData);
            })
            .catch((err) => errorHandeler(err, request, response));
          }
        
      })
      .catch((err) => {
        response.status(500).send(err);
      });
    //  console.log(res.rows);

  }
  function weatherHandeler(){
    // response.status(200).send
    // console.log(request.query.search_query);
    superagent(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${process.env.weatherCode}`)
      .then((weathres) => {
        // response.status(200).json(weathres.body);
        const weatherData = weathres.body;
          
        Weather.all = weatherData.data.map((day) =>{
          return new Weather(day);
        });
        // console.log(Weather.all);
        //         weatherData.data.forEach(element => {
        //     var weather = new Weather(element);
        //     Weather.all.push(weather);
        //   });
        // response.status(200).json(Weather.all);
      })
      .catch((err) => errorHandeler(err, request, response));
  }
  function trailsHandeler(){
    // response.status(200).send
    // console.log(request.query.search_query);
    superagent(`https://www.hikingproject.com/data/get-trails?lat=${Location.current.latitude}&lon=${Location.current.longitude}&maxDistance=400&key=${process.env.haikCode}`)
      .then((trailsres) => {
      //   response.status(200).json(trailsres.body);
        //   const weatherData = weathres.body;
           
        Trail.avelable = trailsres.body.trails.map((trail =>{
          return new Trail(trail);
        }));
        // console.log(Trail.avelable);
        //   weatherData.data.forEach(element => {
        //     var weather = new Weather(element);
        //     Weather.all.push(weather);
        //   });
        // response.status(200).json(Trail.avelable);
      })
      .catch((err) => errorHandeler(err, request, response));
  }
  function notFoundHandeler(request,response){
    response.status(404).send('error 404 page not found');
  }
  function errorHandeler(error,request,response){
    response.status(500).send(`Sorry, something went wrong`);
  }
  function Trail(obj){
    this.name =obj.name;
    this.location =obj.location;
    this.length =obj.length;
    this.stars =obj.stars;
    this.star_votes =obj.starVotes;
    this.summary =obj.summary;
    this.trail_url =obj.url;
    this.conditions =obj.conditionStatus;
    this.condition_date =obj.conditionDate.slice(0,10);
    this.condition_time =obj.conditionDate.slice(10);
  }
  Trail.avelable ;
  function Location(city,geoData){
    this.search_query = city;
    this.formatted_query =geoData[0].display_name;
    this.latitude =geoData[0].lat;
    this.longitude = geoData[0].lon;
  }
  Location.current ;
  function Weather(obj){
    this.forecast=obj.weather.description;
    this.time = new Date(obj.valid_date).toDateString();
  }
  Weather.all =[];

app.get('/add', (req, res) => {
    weatherHandeler();
    trailsHandeler();
    console.log(Weather.all);
    console.log(Trail.avelable);
//   let name = req.query.name;
//   let role = req.query.role;
  const SQL = 'INSERT INTO data(name,location,weather,trails) VALUES ($1,$2,$3,$4) RETURNING *';
  const safeValues = [city,Location.current,JSON.stringify(Weather.all),JSON.stringify(Trail.avelable)];
  client
    .query(SQL, safeValues)
    .then((results) => {
      res.status(200).json(results.rows);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.get('/data', (req, res) => {
  const SQL = 'SELECT * FROM data';
  client
    .query(SQL)
    .then((results) => {
      res.status(200).json(results.rows);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
app.use('*',notFoundHandeler);
app.use(errorHandeler);
client
  .connect()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`my server is up and running on port ${PORT}`)
    );
  })
  .catch((err) => {
    throw new Error(`startup error ${err}`);
  });
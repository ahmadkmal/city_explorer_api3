'use strict';
require('dotenv').config();
const superagent = require('superagent');
function trailsHandeler(request,response){
    // response.status(200).send
    // console.log(request.query.search_query);
    superagent(`https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&maxDistance=100&key=${process.env.haikCode}`)
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
        response.status(200).json(Trail.avelable);
      })
      .catch((err) => errorHandeler(err, request, response));
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
  module.exports = trailsHandeler;
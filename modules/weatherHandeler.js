'ues srict';
require('dotenv').config();
const superagent = require('superagent');
function weatherHandeler(request,response){
    // response.status(200).send
    // console.log(request.query.search_query);
    superagent(`https://api.weatherbit.io/v2.0/forecast/daily?city=${request.query.search_query}&key=${process.env.weatherCode}`)
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
        response.status(200).json(Weather.all);
      })
      .catch((err) => errorHandeler(err, request, response));
  }

  function Weather(obj){
    this.forecast=obj.weather.description;
    this.time = new Date(obj.valid_date).toDateString();
  }
  Weather.all =[];
  module.exports = weatherHandeler;
'use strict';
require('dotenv').config();
const superagent = require('superagent');
function moviesHandeler(request,response){
    // response.status(200).send
    // &query=${request.query.search_query}
    //  console.log('hi',process.env.MOVIE_API_KEY);
    // https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1
    superagent(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${request.query.search_query}&page=1`)
      .then((moviesres) => {
        //  response.status(200).json(moviesres.body.results);
        //   const weatherData = weathres.body;
           
        Movies.avelable = moviesres.body.results.map((movie =>{
          return new Movies(movie);
        }));
        // console.log(Trail.avelable);
        //   weatherData.data.forEach(element => {
        //     var weather = new Weather(element);
        //     Weather.all.push(weather);
        //   });
        response.status(200).json(Movies.avelable);
      })
      .catch((err) => errorHandeler(err, request, response));
  }
//   "title": "Sleepless in Seattle",
//     "overview": "A young boy who tries to set his dad up on a date after the death of his mother. He calls into a radio station to talk about his dad’s loneliness which soon leads the dad into meeting a Journalist Annie who flies to Seattle to write a story about the boy and his dad. Yet Annie ends up with more than just a story in this popular romantic comedy.",
//     "average_votes": "6.60",
//     "total_votes": "881",
//     "image_url": "https://image.tmdb.org/t/p/w500/afkYP15OeUOD0tFEmj6VvejuOcz.jpg",
//     "popularity": "8.2340",
//     "released_on": "1993-06-24"
  function Movies(obj){
    this.title =obj.title;
    this.overview =obj.overview;
    this.average_votes =obj.vote_average;
    this.total_votes =obj.vote_count;
    this.image_url ='https://image.tmdb.org/t/p/w220_and_h330_face'+obj.poster_path;
    this.popularity =obj.popularity;
    this.released_on =obj.release_date;
  }
  Movies.avelable ;
  function errorHandeler(error,request,response){
    response.status(500).send(`Sorry, something went wrong`);
  }
  module.exports = moviesHandeler;
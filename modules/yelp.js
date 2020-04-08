'use strict';
 require('dotenv').config();
 const superagent = require('superagent');
 const apiKey = process.env.YELP_API_KEY;

function yelpHandeler(request,response){
    const url = `https://api.yelp.com/v3/businesses/search?location=${request.query.search_query}`;
    superagent.get(url)
        .set('Authorization', `Bearer ${apiKey}`)
        .then(res=> {
            // response.status(200).json(res.body.businesses);
            Resturant.all = res.body.businesses.map((val) => {
                return new Resturant(val);
            })
            response.status(200).json(Resturant.all);
        })
}
// "name": "Pike Place Chowder",
//     "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/ijju-wYoRAxWjHPTCxyQGQ/o.jpg",
//     "price": "$$   ",
//     "rating": "4.5",
//     "url": "https:/
function Resturant(obj){
this.name = obj.name;
this.image_url = obj.image_url;
this.price = obj.price;
this.rating = obj.rating;
this.url = obj.url;
}
Resturant.all;
module.exports = yelpHandeler;
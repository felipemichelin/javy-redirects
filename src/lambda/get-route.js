'use strict';

var request = require("request");
var config = require("dotenv").config();


export function handler(event, context, callback) {

  // which URL code are we trying to retrieve?
  var influencer = event.queryStringParameters['influencer'];

  // where is the data?
  var url = "https://api.netlify.com/api/v1/forms/" + process.env.ROUTES_FORM_ID + "/submissions/?access_token=" + process.env.API_AUTH;

  request(url, function(err, response, body){

    // look for this code in our stash
    if(!err && response.statusCode === 200){
      var routes = JSON.parse(body);

      for(var item in routes) {
        // return the result when we find the match
        if(routes[item].data.influencer == influencer) {
          console.log("We searched for " + influencer + " and we found " + routes[item].data.destination);
          return callback(null, {
            statusCode: 200,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({influencer: influencer, url: routes[item].data.destination})
          })
        }
      }
    } else {
      return callback(null, {
        statusCode: 200,
        body: err
      })
    }
  });

}

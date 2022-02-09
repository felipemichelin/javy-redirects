'use strict';

var request = require("request");
var config = require("dotenv").config();


export function handler(event, context, callback) {

  // Set the root URL according to the Netlify site we are within
  var rootURL =  process.env.URL + "/";

  // get the details of what we are creating
  var destination = event.queryStringParameters['to'];
  var influencer = event.queryStringParameters['utm_campaign'];
  var platform = event.queryStringParameters['utm_source'];
  var full_destination = "https://try.javycoffee.com/lp17/" + "?utm_source=" + platform + "&utm_medium=influencer" + "&utm_campaign=" + influencer;


  // ensure that a protocol was provided
  if(full_destination.indexOf("://") == -1) {
    full_destination = "http://" + full_destination;
  }

  // prepare a payload to post
  var payload = {
    'form-name' : "routes",
    'destination': full_destination,
    'platform': platform,
    'influencer': influencer,
    'expires': ""
  };

  // post the new route to the Routes form
  request.post({'url': rootURL, 'formData': payload }, function(err, httpResponse, body) {
    var msg;
    if (err) {
      msg = "Post to Routes stash failed: " + err;
    } else {
      msg = "Route registered. Site deploying to include it. " + rootURL + influencer
    }
    console.log(msg);
    // tell the user what their shortcode will be
    return callback(null, {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"url": rootURL + influencer})
    })
  });

  fetch('https://api.netlify.com/build_hooks/62030a5b7825a8160d0e5b5a');


  // ENHANCEMENT: check for uniqueness of shortcode
  // ENHANCEMENT: let the user provide their own shortcode
  // ENHANCEMENT: dont' duplicate existing routes, return the current one
  // ENHANCEMENT: allow the user to specify how long the redirect should exist for

}

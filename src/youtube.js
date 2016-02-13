var google = require('googleapis');
var fs = require('fs');
var config = require('../config.js');
var helper = require('./helper');
var open = require('open');
var Lien = require("lien")

var oauth = google.auth.OAuth2;
var client = new oauth(config.YOUTUBE_CLIENT_ID, config.YOUTUBE_CLIENT_SECRET, config.YOUTUBE_REDIRECT_URL);

//https://github.com/google/google-api-nodejs-client/#authorizing-and-authenticating
exports.getAccessToken = function(next) {
   
   open(client.generateAuthUrl({
      access_type: 'offline', // will return a refresh token
      scope: 'https://www.googleapis.com/auth/youtube.upload' // can be a space-delimited string or an array of scopes
   }));
   // Init the lien server
   var server = new Lien({
       host: "localhost"
     , port: 5000
   });
   // Here we're waiting for the OAuth2 redirect containing the auth code
   server.page.add("/oauth2callback", function (lien) {
      console.log("Getting token using: " + lien.search.code);
      // Get the access token
      client.getToken(lien.search.code, function(err, tokens) {
         if (err) { 
            lien.end(err, 400); 
            console.log(err); 
         }
         else {
            // Set the credentials
            client.setCredentials(tokens);
            next();
         }
      });
   });
};

exports.refresh = function(next) {
   client.refreshAccessToken(function(err, tokens) {
      if(err) {
         console.log("Error refreshing access token. Error: " + err);
      }
      else {
         client.setCredentials(tokens);
         console.log('Access token refreshed.');
         if(next) {
            next();
         }
      }
   });
};

exports.upload = function(title, description, file, next) {
   var youtube = google.youtube({version: 'v3', auth: client});
   youtube.videos.insert({
      part: 'status,snippet',
      resource: {
         snippet: {
            title: title,
            description: description,
            categoryId: 20 // Category may change depending on region https://developers.google.com/youtube/v3/docs/videoCategories/list
         },
         status: {
            privacyStatus: 'public'
         }
      },
      media: {
         body: fs.createReadStream(file)
      }
   }, function(err, data) {
      if(err)
         next(err, null);
      else
         next(null, data);
   });
};
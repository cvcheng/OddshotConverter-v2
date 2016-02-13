var request = require('request');
var fs = require('fs');
var rawjs = require('raw.js');
//var youtube =  require('./youtube');
var models = require('./sequelize');
var helper = require('./helper');
var config = require('../config.js');

var open = require('open');
var robot = require("robotjs");
var sleep = require('sleep');
var sanitize = require("sanitize-filename");
const notifier = require('node-notifier');

var google = require ('googleapis');
google.options ({ auth: 'AIzaSyBFLuXe1xkHZEBcqOkyU9ivCyR-yIvl4Hk' });
var youtube = google.youtube ('v3');

var reddit = exports.reddit =  new rawjs('Oddshot Converter by /u/OddshotBotImposter'); // Descriptive user agent

exports.fetch = function(subreddit, limit) {

   reddit.new({r: 'all', limit: 15}, function(err, res) {
      if(err) {
         helper.errorHandler('Error fetching posts. Error: ' + err);
      } else {
         res.children.forEach(function(data) {
            if (data.data.domain == 'oddshot.tv' && data.data.over_18 == false && data.data.score >= config.REDDIT_MIN_SCORE)
               models.posts.count({where: {postUrl: data.data.url.toLowerCase()}}).then(function(c) {
                  if(c === 0) {
                     notifier.notify({
                       'title': 'New Oddshot found',
                       'message': data.data.permalink,
                       sound: true
                     });
                     console.log('Found: https://www.reddit.com' + data.data.permalink);
                     models.posts.create({postId: data.data.id, postUrl: data.data.url.toLowerCase(), mirror: 'pending', commentId: 'pending'}).then(function(post) {
                        convert('link', data, post);
                     });
                  }
               });
         });
      }
   });

   reddit.new({r: subreddit, limit: 100}, function(err, res) {
      if(err) {
         helper.errorHandler('Error fetching posts. Error: ' + err);
      } else {
         res.children.forEach(function(data) {
            if(data.data.domain == 'oddshot.tv' && data.data.over_18 == false && data.data.score >= config.REDDIT_MIN_SCORE) {
               models.posts.count({where: {postUrl: data.data.url.toLowerCase()}}).then(function(c) {
                  if(c === 0) {
                     notifier.notify({
                       'title': 'New Oddshot found',
                       'message': data.data.permalink,
                       sound: true
                     });
                     console.log('Found: https://www.reddit.com' + data.data.permalink);
                     models.posts.create({postId: data.data.id, postUrl: data.data.url.toLowerCase(), mirror: 'pending', commentId: 'pending'}).then(function(post) {
                        convert('link', data, post);
                     });
                  }
               });
            }
            else if (data.data.is_self == true && data.data.selftext_html != null && data.data.over_18 == false && data.data.score >= config.REDDIT_MIN_SCORE) {
               //if (data.data.selftext_html.indexOf("http://oddshot.tv/shot/") > -1) {
               var match = data.data.selftext_html.match("(?!\")(http://oddshot.tv/shot/).+?(?=\")"); //matches links between quotations
               if (match !== null) {
                  models.posts.count({where: {postUrl: data.data.url.toLowerCase()}}).then(function(c) {
                     if(c === 0) {
                        notifier.notify({
                          'title': 'New Oddshot found',
                          'message': data.data.permalink,
                          sound: true
                        });
                        console.log('Found: https://www.reddit.com' + data.data.permalink);
                        models.posts.create({postId: data.data.id, postUrl: data.data.url.toLowerCase(), mirror: 'pending', commentId: 'pending'}).then(function(post) {
                           convert('text', data, post);
                        });
                     }
                  });
               }
            }
         });
      }
   });
};

function getLatestVideo(title, callback) {
   youtube.search.list (
      {
        part: 'snippet',
        channelId: 'UCtvyC_WxcIafQJHogY3wXTg',
        type: 'video',
        order: 'date',
        maxResults: 1
      },
      function (err, res) {
        if (err)
          console.log('Error fetching latest video. ' + err);
        else {
          //res.items.forEach (function (result) {
            //console.log(title + ' === ' + res.items[0].snippet.title);
            if (res.items[0].snippet.title === title) {
              if (callback)
                callback('https://youtu.be/' + res.items[0].id.videoId);
            }
            else {
              setTimeout(getLatestVideo, 3000, title, callback);
              //sleep.sleep(2);
              //getLatestVideo(title, callback);
            }
          //});
        }
      }
    );
};

function convert(type, data, post) {
   var oddshotlink = '';
   if (type === 'link')
      oddshotlink = data.data.url;
   else if (type === 'text')
      oddshotlink = data.data.selftext_html.match("(?!\")(http://oddshot.tv/shot/).+?(?=\")")[0];
   request(oddshotlink, function (err , res, body) {
      if(err) {
         helper.errorHandler('Request error. Error: ' + err);
      } else if(res.statusCode != 200) {
         helper.errorHandler('Request error. Error: Status Code ' + res.statusCode);
      } else {
         if(body.indexOf('Shot is pending...') < 0 && body.indexOf('Shot processing...') < 0) {
            var url = body.match('source src=(?:"|\')(.*?)(?:"|\') type=(?:"|\')video/mp4(?:"|\')')[1];
            var fileName = sanitize(data.data.title);
            var dir = './tmp/' + fileName + '.mp4';

            if (!fs.existsSync('./tmp/')) { // TODO: Apparently this is bad practice (?)
               fs.mkdirSync('./tmp/');
            }

            request(url).pipe(fs.createWriteStream(dir)).on('close', function () {
               open('https://www.youtube.com/upload');
               robot.moveMouse(812, 300);
               sleep.sleep(7);
               robot.mouseClick();
               sleep.sleep(4);
               robot.typeString('C:\\Users\\WALL-E\\Desktop\\OddshotConverter v2\\tmp\\' + fileName);
               sleep.sleep(5);
               robot.keyTap("enter");
               sleep.sleep(5);
               robot.moveMouse(1375, 176);
               sleep.sleep(2);
               robot.mouseClick();
               sleep.sleep(10);
               robot.mouseClick();
               sleep.sleep(15);

               getLatestVideo(fileName, function(ytUrl) {
                  reddit.comment(data.data.name, '[YouTube Link](' + ytUrl + ')', function (err, comment) {
                     if (err) {
                        helper.errorHandler('Failed to comment. Error: ' + err);
                        post.updateAttributes({commentId: err});
                     } else {
                        post.updateAttributes({commentId: comment.data.id});
                        console.log('Done converting https://www.reddit.com' + data.data.permalink + ' to ' + ytUrl);
               
                        fs.unlink(dir, function (err) {
                           if (err) {
                              helper.errorHandler('Error removing file. Error: ' + err);
                           }
                        })
                      }
                  });
               });
            });
         } else {
            console.error('Unable to convert ' + data.data.title + ', retrying in 10 seconds.');
            setTimeout(convert, 10000, type, data, post);
          }
      }
   });
};
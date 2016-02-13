console.log('REMEMBER: Set focus to chrome window on main monitor and set account to HelloWorld.');
//var youtube =  require('./src/youtube');
var oddshot = require('./src/oddshot');
var helper = require('./src/helper');
var config = require('./config.js');

//youtube.getAccessToken(function() {
   oddshot.reddit.setupOAuth2(config.REDDIT_CLIENT_ID, config.REDDIT_CLIENT_SECRET, config.REDDIT_REDIRECT_URL); // REDIRECT_URI is optional and never used. https://github.com/reddit/reddit/wiki/OAuth2
   oddshot.reddit.auth({username: config.REDDIT_USERNAME, password: config.REDDIT_PASSWORD}, function(err) { // Reddit account username & password
      if(err) {
         helper.errorHandler('Reddit authentication failed. Error: ' + err);
      } else {
         console.log('Reddit authentication complete.');
         console.log('Fetching Reddit posts...');
         setInterval(oddshot.fetch, 5000, config.REDDIT_SUBREDDIT, config.REDDIT_FETCH_LIMIT); // maximum 30 requests per minute https://github.com/reddit/reddit/wiki/API
         //setInterval(youtube.refresh, 1800000); // YouTube access_token expires every 1 hour, refresh for a new token every 30 minutes.
         // TODO: Crontab might be more useful
      }
   });
//});
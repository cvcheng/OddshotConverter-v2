// Reddit - https://www.reddit.com/r/rawjs/wiki/documentation / https://github.com/reddit/reddit/wiki/OAuth2
//hearthstone+speedrun+globaloffensive+dota2+starcraft
exports.REDDIT_SUBREDDIT = ''; // Use "+" for multiple subreddits (ex. funny+videos+pics)
exports.REDDIT_FETCH_LIMIT = 100; // Maximum number of posts per request (max: 100)
exports.REDDIT_MIN_SCORE = 5; //Only check listings with the minimum score met
exports.REDDIT_CLIENT_ID = '';
exports.REDDIT_CLIENT_SECRET = '';
exports.REDDIT_REDIRECT_URL = ''; // Optional and never used
exports.REDDIT_USERNAME = '';
exports.REDDIT_PASSWORD = '';

// YouTube - https://github.com/google/google-api-nodejs-client / https://developers.google.com/youtube/registering_an_application
exports.YOUTUBE_CLIENT_ID = '';
exports.YOUTUBE_CLIENT_SECRET = '';
exports.YOUTUBE_REDIRECT_URL = 'http://localhost:5000/oauth2callback'; // Optional and never used

// Database - http://docs.sequelizejs.com/en/latest/docs/getting-started/
exports.DB_DATABASE = 'oddshot';
exports.DB_USERNAME = 'root';
exports.DB_PASSWORD = 'password';
exports.DB_HOST = 'localhost';
exports.DB_PORT = 3306;
exports.DB_DIALECT = 'mysql';

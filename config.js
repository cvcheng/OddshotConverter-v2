// Reddit - https://www.reddit.com/r/rawjs/wiki/documentation / https://github.com/reddit/reddit/wiki/OAuth2
//hearthstone+speedrun+globaloffensive+dota2+starcraft
exports.REDDIT_SUBREDDIT = 'hearthstone+speedrun+globaloffensive+dota2+starcraft'; // Use "+" for multiple subreddits (ex. funny+videos+pics)
exports.REDDIT_FETCH_LIMIT = 100; // Maximum number of posts per request (max: 100)
exports.REDDIT_MIN_SCORE = 5; //Only check listings with the minimum score met
exports.REDDIT_CLIENT_ID = '1FGA7VvJ9MMvAg';
exports.REDDIT_CLIENT_SECRET = 'd60ExXYiWVZZ3y4iwtETKYEaHSU';
exports.REDDIT_REDIRECT_URL = ''; // Optional and never used
exports.REDDIT_USERNAME = 'OddshotBotImposter';
exports.REDDIT_PASSWORD = '349761';

// YouTube - https://github.com/google/google-api-nodejs-client / https://developers.google.com/youtube/registering_an_application
exports.YOUTUBE_CLIENT_ID = '871497324881-5h5govqtnso6a8qt73li6vc18tost02s.apps.googleusercontent.com';
exports.YOUTUBE_CLIENT_SECRET = 'eWT3ThXgBQorENbJMotGWcOy';
exports.YOUTUBE_REDIRECT_URL = 'http://localhost:5000/oauth2callback'; // Optional and never used

// Database - http://docs.sequelizejs.com/en/latest/docs/getting-started/
exports.DB_DATABASE = 'oddshot';
exports.DB_USERNAME = 'root';
exports.DB_PASSWORD = '349761';
exports.DB_HOST = 'localhost';
exports.DB_PORT = 3306;
exports.DB_DIALECT = 'mysql';
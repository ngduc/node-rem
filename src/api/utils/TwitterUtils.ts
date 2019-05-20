// import OAuth from 'oauth';
// import Twitter from 'twitter';

const { TWITTER_API_KEY, TWITTER_API_SECRET } = require('config/vars');
const OAuth = require('oauth');
const Twitter = require('twitter');

let twitterAccessToken = '';
let twitterClient: any = null;

export const authTwitter = () => {
  console.log('- authTwitter');
  const oauth2 = new OAuth.OAuth2(
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    'https://api.twitter.com/',
    null,
    'oauth2/token',
    null
  );
  console.log('--- Twitter OAuth...');
  oauth2.getOAuthAccessToken(
    '',
    { grant_type: 'client_credentials' },
    (e: any, access_token: string, refresh_token: string, results: any) => {
      twitterAccessToken = access_token;
      console.log('> Bearer: ', twitterAccessToken);

      twitterClient = new Twitter({
        consumer_key: TWITTER_API_KEY,
        consumer_secret: TWITTER_API_SECRET,
        bearer_token: twitterAccessToken
      });
      console.log('> Twitter OAuth Access Token: ' + twitterAccessToken);
    }
  );
};

export const fetchTwitterUserDetails = (twitterId: string) => {
  return new Promise((resolve, reject) => {
    const params = { screen_name: twitterId };
    console.log('--- fetchTwitterTimeline... ' + twitterId);
    twitterClient.get('users/show', params, async (error: any, data: any) => {
      if (error) {
        console.log('ERROR: ', error);
        // reject(error) // will cause UI promise exception
        resolve({ error, data: [] });
      } else {
        // console.log(tweets)
        // DBCache.cache('twitter_user_timeline', params, tweets) // cache raw tweets
        // console.log('> fetchTwitterUser', data);
        resolve({ data });
      }
    });
  });
};

// module.exports = {
//   authTwitter,
//   fetchTwitterUserDetails
// };

const mongoose = require('mongoose');
import { Post, Person, DBCache } from 'api/models';

const { TWITTER_API_KEY, TWITTER_API_SECRET } = require('config/vars');
const OAuth = require('oauth');
const Twitter = require('twitter');

let twitterAccessToken = '';
let twitterClient: any = null;

// save but ignore the duplicate key error.
const safeSave = async (Model: any, obj: any) => {
  return await new Model(obj).save((err: any) => {
    if (err && err.code === 11000) {
      // duplicate key error
    }
  });
};

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

// update a person info from a tweet's info (followers, lastPost, etc.)
const updatePersonFromTweets = async (person: any, newTweets: any) => {
  console.log('--- updatePersonFromTweet');
  if (!newTweets || newTweets.length === 0) {
    return null;
  }
  const posts = await Post.find({ author: mongoose.Types.ObjectId(person._id) })
    .limit(1000)
    .sort({ postedAt: 'desc' });
  // const firstPostTime = posts && posts[0] ? moment(posts[0].postedAt) : +new Date();
  // const lastPostTime = posts && posts[0] ? moment(posts[posts.length - 1].postedAt) : +new Date();
  const firstPostTime = posts && posts[0] ? posts[0].postedAt : +new Date();
  const lastPostTime = posts && posts[0] ? posts[posts.length - 1].postedAt : +new Date();
  const diffDays = firstPostTime.diff ? firstPostTime.diff(lastPostTime, 'days') : 1;
  const avgPerDay = Math.round((1 * posts.length) / diffDays);
  const avgPerWeek = Math.round((7 * posts.length) / diffDays);

  const firstTweet = newTweets[0];
  const followers = firstTweet.user && firstTweet.user.followers_count ? firstTweet.user.followers_count : null;
  if (followers !== null) {
    const p = await Person.findByIdAndUpdate(person._id, {
      lastPostText: processTweet(firstTweet),
      lastPostTime: +new Date(), // moment(firstTweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en'),
      lastFetch: +new Date(),
      avgPerDay,
      avgPerWeek,
      followers
    });
    return p;
  }
};

const fetchTwitterTimeline = (twitterId: string, optionalPerson?: any) => {
  return new Promise((resolve, reject) => {
    // twitterClient.get('application/rate_limit_status', {}, (error, response) => {
    //   if (error) {
    //     console.log('ERROR: ', error)
    //     reject(error)
    //   } else {
    //     // console.log(tweets)
    //     DBCache.cache('twitter_rate_limit_status', {}, response)
    //   }
    // })

    const params = { screen_name: twitterId, tweet_mode: 'extended', exclude_replies: true, count: 100 };
    console.log('--- fetchTwitterTimeline... ' + twitterId);
    twitterClient &&
      twitterClient.get('statuses/user_timeline', params, async (error: any, tweets: any, response: any) => {
        if (error) {
          console.log('ERROR: ', error);
          // reject(error) // will cause UI promise exception
          resolve([]);
        } else {
          // console.log(tweets)
          DBCache.cache('twitter_user_timeline', params, tweets); // cache raw tweets
          console.log('> fetchTwitterTimeline - tweets: ' + tweets.length);
          updatePersonFromTweets(optionalPerson, tweets); // asynchronously (don't wait for this)
          resolve(tweets);
        }
      });
  });
};

const processTweet = (tweet: any) => {
  let text = tweet.full_text || tweet.text;
  if (text.indexOf('RT @') === 0 && tweet.retweeted_status) {
    // sometimes RT text is so long that the original text gets cut off => this keeps original text:
    const arr = text.split(':');
    text = arr[0] + ': ' + (tweet.retweeted_status.full_text || tweet.retweeted_status.text);
  }
  return text;
};

const savePostsFromTweets = async (person: any, tweets: any) => {
  for (const t of tweets) {
    const text = processTweet(t);
    let imageUrl = null;
    let imageLinkUrl = null;
    if (t.entities && t.entities.media && t.entities.media.length > 0 && t.entities.media[0].media_url_https) {
      imageUrl = t.entities.media[0].media_url_https;
      imageLinkUrl = t.entities.media[0].url || null;
    }
    const post = {
      author: new mongoose.Types.ObjectId(person._id),
      authorFullName: `${person.firstName} ${person.lastName}`,
      authorCategory: person.category,
      type: 'twitter',
      extPostId: t.id_str,
      extAuthorId: t.user.screen_name,
      title: text,
      subtitle: '',
      imageUrl: imageUrl,
      imageLinkUrl: imageLinkUrl,
      likes: t.favorite_count,
      withUrl: t.entities.urls && t.entities.urls[0] ? t.entities.urls[0].url : '',
      postedAt: t.created_at // moment(t.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en')
    };
    await safeSave(Post, post);
  }
};

export const fetchAndSavePosts = async (person: any) => {
  const tweets = await fetchTwitterTimeline(person.twitterId, person);
  await savePostsFromTweets(person, tweets);
  return tweets;
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
        // DBCache.cache('twitter_user_timeline', params, data); // cache raw tweets
        console.log('> fetchTwitterUser', JSON.stringify(data));
        resolve({ data });
      }
    });
  });
};

const _fetchAllPeoplePosts = async () => {
  const people = await Person.find();
  console.log('--- FETCH ALL POSTS', people);
  for (let i = 0; i < people.length; i++) {
    setTimeout(() => {
      fetchAndSavePosts(people[i]);
    }, 2000 * i);
  }
};

export const repeatPostFetching = () => {
  setInterval(_fetchAllPeoplePosts, 30 * 60 * 1000); // every 30 mins (10 * 60 * 1000)
  setTimeout(() => {
    _fetchAllPeoplePosts();
  }, 3000); // wait for Twitter Authentication
};

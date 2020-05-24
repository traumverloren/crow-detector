const Twitter = require('twitter');
const fs = require('fs');
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

function sendTweet(images) {
  // Make post request on media endpoint. Pass file data as media parameter
  client.post('media/upload', { media: images }, function (
    error,
    media,
    response
  ) {
    if (!error) {
      // If successful, a media object will be returned.
      console.log('Images uploaded!');

      // Tweet it
      const status = {
        status: '🥜 time!',
        media_ids: media.media_id_string, // Pass the media id string
      };

      client.post('statuses/update', status, function (error, tweet, response) {
        if (!error) {
          console.log('Tweet sent!');
        }
      });
    }
  });
}

module.exports = {
  sendTweet,
};

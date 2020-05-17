const Twitter = require('twitter');
const fs = require('fs');
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

function sendTweet(filename) {
  // TODO: send multiple images
  // https://github.com/desmondmorris/node-twitter/issues/54

  // Load image
  const data = fs.readFileSync(filename);

  // Make post request on media endpoint. Pass file data as media parameter
  client.post('media/upload', { media: data }, function (
    error,
    media,
    response
  ) {
    if (!error) {
      // If successful, a media object will be returned.
      console.log(media);

      // Tweet it
      const status = {
        status: '🥜 time!',
        media_ids: media.media_id_string, // Pass the media id string
      };

      client.post('statuses/update', status, function (error, tweet, response) {
        if (!error) {
          console.log(tweet);
        }
      });
    }
  });
}

module.exports = {
  sendTweet,
};

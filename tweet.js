const Twitter = require('twitter');
const fs = require('fs');
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const uploadImage = image => {
  return new Promise((resolve, reject) => {
    client.post('media/upload', { media: image }, function (
      error,
      media,
      response
    ) {
      if (!error) {
        console.log('Image uploaded!');
        resolve(media.media_id_string);
      } else {
        console.log(error, 'There was an error posting the image!');
        reject();
      }
    });
  });
};

const uploadImages = images => {
  const promises = [];

  images.forEach(image => {
    promises.push(uploadImage(image));
  });

  return Promise.all(promises);
};

const postTweet = imageIds => {
  const imagesString = imageIds.toString();

  const status = {
    status: '🥜 time!',
    media_ids: imagesString, // Pass the media ids string
  };

  return new Promise((resolve, reject) => {
    client.post('statuses/update', status, function (error, tweet, response) {
      if (!error) {
        console.log('Tweet posted!');
        resolve(tweet);
      } else {
        console.log(error, 'There was an error posting the tweet!');
        reject();
      }
    });
  });
};

const sendTweet = async images => {
  // Make post request on media endpoint. Pass file data as media parameter
  try {
    const imageIds = await uploadImages(images);
    const tweet = await postTweet(imageIds);

    console.log(tweet.text);
    // Tweet it
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  sendTweet,
};

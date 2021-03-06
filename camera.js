const fs = require('fs');
const { spawn, fork } = require('child_process');
const { sendTweet } = require('./tweet');

let count = 1;
let hasMotion;
let imagesArray = [];
const CROW = 'crow';

function startPhoto() {
  hasMotion = true;
  console.log('hasMotion is ', hasMotion);
}

function stopPhoto() {
  hasMotion = false;
  console.log('hasMotion is ', hasMotion);

  if (imagesArray.length > 0) batchPhotos();
}

// Take a photo with the camera module using Raspistill on the command line with spawn
function takePhoto() {
  if (!hasMotion) return;

  let filename = `${__dirname}/photos/image_${count}.jpg`;
  let args = [
    '-rot', // rotate 90 degrees
    '90',
    '-n', // no preview
    '-t', // time to take photo
    '1000', // 1 second
    '-w', // width
    '400',
    '-h', // height
    '400',
    '-ev',
    'auto',
    'auto',
    '-o',
    filename,
  ];
  const child = spawn('raspistill', args);

  child.on('exit', code => {
    console.log(filename + ' was taken');
    count++;
    if (hasMotion) takePhoto();

    // Use child_process fork():
    // Send image to trained model to detect if there's a crow
//    let checkPhoto = fork(`${__dirname}/detect.js`);

//    if (/jpg$/.test(filename)) {
//      checkPhoto.send(filename);

      // Get result from model
//      checkPhoto.on('message', data => {
        // console.log(data);

//        if (data === CROW) {
//          console.log('CROW IS HERE!');
          // batch up to 4 photos to upload to twitter
          // batchPhotos(filename);
//        } else {
          // Delete non-crow photos to clean up space for now
          // deletePhoto(filename);
//        }
//      });
  //  }
  });
}

// Batch burst images and send multiple images in 1 tweet
// https://github.com/desmondmorris/node-twitter/issues/54
function batchPhotos(filename = null) {
  // Load image if there
  if (filename) {
    const image = fs.readFileSync(filename);
    imagesArray.push(image);
  }

  console.log('Batching photos to tweet....');
  console.log(imagesArray);

  if (imagesArray.length === 4 || !hasMotion) {
    // Upload images to twitter
    sendTweet(imagesArray);

    // reset images array for next time
    imagesArray.length = 0;
  }
}

function deletePhoto(imgPath) {
  fs.unlink(imgPath, err => {
    if (err) {
      return console.error(err);
    }
    console.log(imgPath + ' is deleted.');
  });
}

module.exports = {
  startPhoto,
  stopPhoto,
  takePhoto,
};

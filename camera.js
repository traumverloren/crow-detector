const fs = require('fs');
const { spawn, fork } = require('child_process');
const { sendTweet } = require('./tweet');

let count = 1;
let hasMotion;
const CROW = 'crow';

function startPhoto() {
  hasMotion = true;
  console.log('hasMotion is ', hasMotion);
}

function stopPhoto() {
  hasMotion = false;
  console.log('hasMotion is ', hasMotion);
}

// Take a photo with the camera module using Raspistill on the command line with spawn
function takePhoto() {
  if (!hasMotion) return;

  let filename = `${__dirname}/photos/image_${count}.jpg`;
  let args = [
    '-bm', // burst mode
    '-n', // no preview
    '-t', // time to take photo
    '200',
    '-w', // width
    '400',
    '-h', // height
    '400',
    '-q', // quality : highest
    '100',
    '-awb',
    'auto',
    '-o',
    filename,
    '-ex', // exposure setting
    'auto',
  ];
  const child = spawn('raspistill', args);

  child.on('exit', code => {
    console.log(filename + ' was taken');
    count++;
    if (hasMotion) takePhoto();

    // Use child_process fork():
    // Send image to trained model to detect if there's a crow
    let checkPhoto = fork(`${__dirname}/detect.js`);
    checkPhoto.send(filename);

    // Get result from model
    checkPhoto.on('message', data => {
      console.log(data);

      if (data === CROW) {
        console.log('CROW IS HERE!');
        // upload to twitter
        sendTweet(filename);
      } else {
        // Delete non-crow photos to clean up space for now
        deletePhoto(filename);
      }
    });
  });
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

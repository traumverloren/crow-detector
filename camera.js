const fs = require('fs');
const { spawn, fork } = require('child_process');
let count = 0;

const CROW = 'crow';

// Take a photo with the camera module using Raspistill on the command line with spawn
function takePhoto() {
  let filename = `${__dirname}/photos/image_${count}`;
  let args = [
    '-tl', // timelapse
    '600', // 5 shots over 3 secondes
    '-t', // time to take shot (3s since sunny)
    '3000',
    '-bm', // burst mode
    '-n', // no preview
    '-w', // width
    '800',
    '-h', // height
    '800',
    '-q', // quality : highest
    '100',
    '-o',
    `${filename}-%01d.jpg`,
    '-ex', // exposure setting
    'sports',
  ];
  const child = spawn('raspistill', args);

  child.on('exit', code => {
    console.log(filename + ' was taken');

    if (count % 5 === 0) {
      console.log(filename);
      // Use child_process fork():
      // read the first image and use trained model to detect if there's a crow
      let checkPhoto = fork('./detect.js');
      checkPhoto.send(filename);

      // Get result from model
      checkPhoto.on('message', data => {
        console.log(data);

        if (data === CROW) {
          // upload to twitter
        }

        // TODO: Delete photos to clean up space
        // deletePhoto(filename);
      });
    }

    count++;

    if (count % 5 !== 0) {
      console.log(count);
      takePhoto();
    }
  });
}

function deletePhoto(path) {
  fs.unlink(path, err => {
    if (err) {
      return console.error(err);
    }
    console.log(path + ' is deleted.');
  });
}

module.exports = {
  takePhoto,
};

const fs = require('fs');
const { spawn, fork } = require('child_process');
let count = 1;

const CROW = 'crow';

// Take a photo with the camera module using Raspistill on the command line with spawn
function takePhoto() {
  let filename = `${__dirname}/photos/image_${count}`;
  let args = [
    '-tl', // timelapse
    '600', // 5 shots over 3 secondes
    '-t', // time to take shot (3s since sunny)
    '3000',
    '-fs', // start burst count at 1
    '1',
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
    'auto',
  ];
  const child = spawn('raspistill', args);

  child.on('exit', code => {
    console.log(filename + ' was taken');

    // Use child_process fork():
    // Send first burst image to trained model to detect if there's a crow
    let checkPhoto = fork('./detect.js');
    checkPhoto.send(`${filename}-1.jpg`);

    // Get result from model
    checkPhoto.on('message', data => {
      console.log(data);

      if (data === CROW) {
        // upload to twitter
      }

      // TODO: Delete photos to clean up space
      // deletePhoto(filename);
    });

    count++;
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

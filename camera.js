const fs = require('fs');
const { spawn, fork } = require('child_process');
let count = 0;

// Take a photo with the camera module using Raspistill on the command line with spawn
function takePhoto() {
  let filename = `${__dirname}/photos/image_${count}.jpg`;
  let args = ['-bm', '-w', '400', '-h', '400', '-o', filename, '-t', '1'];
  const child = spawn('raspistill', args);

  child.on('exit', code => {
    console.log(filename + ' was taken');

    if (count % 5 === 0) {
      console.log(filename);
      // Child process: read the first image and detect crow with trained model
      let checkPhoto = fork('./detect.js');
      checkPhoto.send(filename);

      // the child process is completed
      checkPhoto.on('message', data => {
        console.log(data);
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

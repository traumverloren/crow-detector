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
    count++;

    if (count % 5 !== 0) {
      console.log(count);
      takePhoto();
    }
  });
}

module.exports = {
  takePhoto,
};

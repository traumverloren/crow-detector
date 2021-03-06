require('dotenv').config();

// PIR Sensor stuff
const gpio = require('onoff').Gpio;
const pir = new gpio(4, 'in', 'both');

const { takePhoto, startPhoto, stopPhoto } = require('./camera');
/**
 * 1. Watch for motion detected ✅
 * 2. When motion detected, take a picture ✅
 * 3. send pics thru tfjs trained crow/dog/etc model ✅
 * 4. keep taking photos while motion detected ✅
 * 5. if determined it's a crow, tweet photos! ✅
 */

// Process blocking action which can halt
// your program if deleting a large directory tree
// fs.rmdirSync(`${__dirname}/photos`, { recursive: true });
// fs.mkdirSync(`${__dirname}/photos`);
// console.log('Removed old photos');

console.log('STARTING CROW CAM!!!');

pir.watch((err, value) => {
  if (err) {
    throw err;
  }

  console.log(value);

  if (value === 1) {
    console.log('motion DETECTED!');
    startPhoto();
    takePhoto();
  } else if (value === 0) {
    console.log('motion STOPPED!');
    stopPhoto();
  }
});

// Ctrl-C
process.on('SIGINT', _ => {
  pir.unexport();
});

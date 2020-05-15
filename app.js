// PIR Sensor stuff
const gpio = require('onoff').Gpio;
const pir = new gpio(4, 'in', 'rising');

const fs = require('fs');
const { takePhoto } = require('./camera');

/**
 * 1. Watch for motion detected ✅
 * 2. When motion detected, take a picture ✅
 * 3. send first pic thru tfjs trained crow/dog/etc model
 * 4. keep taking arbitary burst of photos ✅
 * 5. if determined it's a crow, tweet photos?
 */

// Process blocking action which can halt
// your program if deleting a large directory tree
fs.rmdirSync(`${__dirname}/photos`, { recursive: true });
fs.mkdirSync(`${__dirname}/photos`);
console.log('Removed old photos');

pir.watch((err, value) => {
  console.log('PIR sensor ON!');
  if (err) {
    throw err;
  }

  if (value === 1) {
    console.log('motion DETECTED!');
    takePhoto();
  }
});

// Ctrl-C
process.on('SIGINT', _ => {
  pir.unexport();
});

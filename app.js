// PIR Sensor stuff
const gpio = require('onoff').Gpio;
const pir = new gpio(4, 'in', 'rising');

// child process stuff
const { takePhoto } = require('./camera');

/**
 * 1. Watch for motion detected ✅
 * 2. When motion detected, take a picture ✅
 * 3. send first pic thru tfjs trained crow/dog/etc model
 * 4. keep taking arbitary burst of photos ✅
 * 5. if determined it's a crow, tweet photos?
 */
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

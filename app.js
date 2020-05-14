// PIR Sensor stuff
const gpio = require('onoff').Gpio;
const pir = new gpio(4, 'in', 'rising');

// child process stuff
const { takePhoto } = require('./camera');

// Tensorflow model stuff
const tf = require('@tensorflow/tfjs-node');
const predict = require('./predict');

const DEFAULT_MODEL_LOCATION = `file:///${__dirname}/model/model.json`;

// let model;

// (async function main() {
//   try {
//     model = await tf.loadLayersModel(DEFAULT_MODEL_LOCATION);
//     model.summary();

//     // Gets the ranked list
//     const results = await predict(model);

//     // Get the top result's name
//     const topResult = results[0].className;
//     console.log('**************************');
//     console.log('Prediction:', topResult);
//     console.log('**************************');
//   } catch (e) {
//     console.error(e);
//   }
// })();

/**
 * 1. Watch for motion detected
 * 2. When motion detected, take a picture.
 * 3. send first pic thru tfjs trained crow/dog/etc model
 * 4. keep taking photos
 * 5. if determined it's a crow, tweet photo?
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

const gpio = require('onoff').Gpio;
const pir = new gpio(4, 'in', 'both');

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

// Johnny-Five for RPi
// const Raspi = require('raspi-io').RaspiIO;
// const five = require('johnny-five');
// const board = new five.Board({
//   io: new Raspi(),
// });

// board.on('ready', () => {
//   console.log('board is ready');

//   // Create a new `motion` hardware instance.
//   const motion = new five.Motion('P1-7'); //a PIR is wired on pin 7 (GPIO 4)

//   // 'calibrated' occurs once at the beginning of a session
//   motion.on('calibrated', () => {
//     console.log('MOTION CALIBRATED');
//   });

//   // Motion detected
//   motion.on('motionstart', () => {
//     console.log('MOTION STARTED');
//   });

//   // 'motionend' events
//   motion.on('motionend', () => {
//     console.log('MOTION ENDED');
//   });
// });

pir.watch((err, value) => {
  if (err) {
    throw err;
  }

  console.log('motion detected!');
});

process.on('SIGINT', _ => {
  pir.unexport();
});

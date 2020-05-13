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

const gpio = require('rpi-gpio');
const pir = {
  pin: 7,
  loopTime: 1500, // check the sensor this often
  tripped: false,
  value: undefined,
};
const readInterval = () => {
  gpio.read(pir.pin, (error, value) => {
    // we only want to move on if something changed
    if (value === pir.tripped) return (pir.tripped = value);
    if (pir.tripped) console.log('tripped!');
    else console.log("it's quiet... a little TOO quiet...");
  });
};
const onSetup = (error) => {
  if (error) console.error(error);
  return setInterval(readInterval, pir.loopTime);
};

gpio.setMode(gpio.MODE_RPI);
gpio.setup(pir.pin, gpio.DIR_IN, onSetup);

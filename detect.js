// Tensorflow model stuff
const tf = require('@tensorflow/tfjs-node');
const predict = require('./predict');

const DEFAULT_MODEL_LOCATION = `file:///${__dirname}/model/model.json`;

let model;

process.on('message', async imagePath => {
  const result = await detect(imagePath);
  result ? process.send(result) : process.send('');

  process.exit(0);
});

process.on('error', err => {
  console.log('Child process error: ', err);
});

async function detect(imagePath) {
  try {
    model = await tf.loadLayersModel(DEFAULT_MODEL_LOCATION);
    model.summary();

    // Gets the ranked list
    const results = await predict(model, imagePath);

    // Get the top result's name
    const topResult = results[0].className;
    console.log('**************************');
    console.log('Prediction:', topResult);
    console.log('**************************');
    return topResult;
  } catch (e) {
    console.error(e);
  }
}

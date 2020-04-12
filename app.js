const tf = require('@tensorflow/tfjs-node');
const predict = require('./predict');

const DEFAULT_MODEL_LOCATION = `file:///${__dirname}/model/model.json`;

let model;

(async function main() {
  try {
    model = await tf.loadLayersModel(DEFAULT_MODEL_LOCATION);
    // model.summary();

    // Gets the ranked list
    const results = await predict(model);

    // Get the top result's name
    const topResult = results[0].className;
    console.log('**************************');
    console.log('Prediction:', topResult);
    console.log('**************************');
  } catch (e) {
    console.error(e);
  }
})();

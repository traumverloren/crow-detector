const tf = require('@tensorflow/tfjs-node');
const predict = require('./predict');

const DEFAULT_MODEL_LOCATION = `file:///${__dirname}/model/model.json`;

let model;

(async function main() {
  try {
    model = await tf.loadLayersModel(DEFAULT_MODEL_LOCATION);
    model.summary();

    const result = await predict(model);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
})();

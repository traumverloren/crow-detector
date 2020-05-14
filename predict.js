const tf = require('@tensorflow/tfjs-node');

const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(224, 224);
const ctx = canvas.getContext('2d');
const Image = require('./image');
const image = new Image(canvas);
const path = require('path');

// get class labels from metadata
const metadata = require('./model/metadata.json');
const labels = metadata.labels;

async function predict(model) {
  // Load the picture
  const image = await loadImage(path.resolve(__dirname, './wilbur.jpg'));

  // model is expecting 224x224 image
  ctx.drawImage(image, 0, 0, 224, 224);

  // crop & make image a tensor with shape [1, 224, 224, 3]
  const inputImage = image.cleanup();

  const logits = tf.tidy(() => {
    return model.predict(inputImage);
  });

  // Convert logits to probabilities and class names.
  const classes = await getTopKClasses(labels, logits, 3);

  logits.dispose();
  inputImage.dispose();

  return classes;
}

/**
 * Referenced from mobilenet & teachable machine:
 * See @teachablemachine/image/src/custom-mobilenet.ts
 *
 * Computes the probabilities of the topK classes given logits by computing
 * softmax to get probabilities and then sorting the probabilities.
 * @param labels metadata labels from Teachable Machine for class names.
 * @param logits Tensor representing the logits from MobileNet.
 * @param topK The number of top predictions to show.
 */
async function getTopKClasses(labels, logits, topK = 3) {
  const values = await logits.data();

  return tf.tidy(() => {
    topK = Math.min(topK, values.length);

    const valuesAndIndices = [];
    for (let i = 0; i < values.length; i++) {
      valuesAndIndices.push({ value: values[i], index: i });
    }
    valuesAndIndices.sort((a, b) => {
      return b.value - a.value;
    });
    const topkValues = new Float32Array(topK);
    const topkIndices = new Int32Array(topK);
    for (let i = 0; i < topK; i++) {
      topkValues[i] = valuesAndIndices[i].value;
      topkIndices[i] = valuesAndIndices[i].index;
    }

    const topClassesAndProbs = [];
    for (let i = 0; i < topkIndices.length; i++) {
      topClassesAndProbs.push({
        className: labels[topkIndices[i]],
        probability: topkValues[i],
      });
    }
    return topClassesAndProbs;
  });
}

module.exports = predict;

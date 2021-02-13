# Crow Detector

_Tweet photos of a crow (verified by a tensorflow machine learning model) from a RPI4 using 100% Javascript!_

![](orville.jpg)

## Tech:

- Node.js
- Tensorflow.js
- Teachable Machine (Train the model)

## Hardware:

- Raspberry Pi 4 (4GB Ram)
- PIR Sensor (set for continuous motion detection)
- ~~Pi Camera V2~~ HD Camera w/ wide angle lens

![](rpi-cam-setup.jpg)

A PIR Sensor detects motion and starts the camera taking burst mode photos as long as motion is continually detected. Since the PIR sensor is quite sensitive, it can give false alarms. So, I trained an image classification model using Google's [Teachable Machine](https://teachablemachine.withgoogle.com) to detect if there's a hooded crow (Nabelkrähe) visiting my window to grab some peanuts. It then tweets the photo if a crow is detected.

Orville the crow pics: https://twitter.com/orvillethecrow

Trained model: https://teachablemachine.withgoogle.com/models/iPcyCDwcz/

This is using a Teachable Machine model trained on real images of my hooded crow friend and runs in Node.js using tfjs-node.

🚨 Note: Runs on RPI4 with these modifications: https://github.com/yhwang/node-red-contrib-tf-model#note

#### To run:

- git clone the repo
- `npm i`
- `node app.js`

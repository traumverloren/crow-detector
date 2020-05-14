# Crow Detector

This project uses an image classification model trained using Google's Teachable Machine to identify each the hooded crow (Nabelkrähe) that visits my window to take the peanuts I leave for them and then tweet their photos.

https://teachablemachine.withgoogle.com/models/1nEpnHry/

This is using a Teachable Machine model trained on images of hooded crows and runs in Node.js using tfjs-node. 100% Javascript!

🚨 Note: Runs on RPI4 with these modifications: https://github.com/yhwang/node-red-contrib-tf-model#note

#### To run:

- git clone the repo
- `npm i`
- `node app.js`

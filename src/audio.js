const extractAudio = require('ffmpeg-extract-audio');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

const files = require('../util/files');

const speechToText = new SpeechToTextV1({
  username: '1f6558ba-4fca-45c7-a0b0-089d258ff550',
  password: 'ie5P3Mc0rCQF',
  url: 'https://stream.watsonplatform.net/speech-to-text/api'
});

const params = {
  content_type: 'audio/mp3',
  timestamps: true,
  interim_results: true,
  max_alternatives: 1,
  objectMode: true,
  model: 'en-US_BroadbandModel'
};

const Audio = {
  getAudio: async (input, output) => {
    await extractAudio({
      input: `resources/${input}`,
      output: `output/${output}`
    });
  },
  getTranscription: filename =>
    new Promise((resolve, reject) => {
      const results = [];
      const filePath = `output/${filename}`;

      const recognizeStream = speechToText.recognizeUsingWebSocket(params);
      files.stream(filePath).pipe(recognizeStream);

      recognizeStream.on('data', data => {
        if (data.results[0].final) results.push(data);
      });
      recognizeStream.on('error', err => {
        reject(err);
      });
      recognizeStream.on('close', () => {
        resolve(results);
      });
    })
};

module.exports = Audio;

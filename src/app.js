require('colors');
const parser = require('subtitles-parser');
const { Spinner } = require('cli-spinner');

const audio = require('./audio');
const subtitle = require('./subtitle');
const translation = require('./translation');

const videoFile = 'test.mp4';
const audioFile = 'test.mp3';
const srtFile = 'test.srt';

const writeStrFile = (filename, speech) => {
  const srtInfo = parser.toSrt(speech);
  subtitle.writeSrtFile(filename, srtInfo);
};

const generateSubtitles = async () => {
  await audio.getAudio(videoFile, audioFile);
  const transcription = await audio.getTranscription(audioFile);
  const speech = subtitle.formatSubtitles(transcription, false);
  writeStrFile(srtFile, speech);
  return speech;
};

const genTranslatedSubs = async speech => {
  const translations = [];
  for (let i = 0; i < speech.length; i += 1) {
    const text = await translation.getTranslation(speech[i].text, 'es');
    translations.push(text);
  }
  const translatedSpeech = subtitle.getTranslatedSubs(translations);
  writeStrFile(`es_${srtFile}`, translatedSpeech);
};

const App = {
  init: async () => {
    const spinner = new Spinner('%s Generating Subtitles...');
    try {
      spinner.setSpinnerString(10);
      spinner.start();

      const speech = await generateSubtitles();
      await genTranslatedSubs(speech);
    } catch (err) {
      console.log('\n ==> '.red, `Something Happened: ${err}`);
    } finally {
      spinner.stop();
    }
  }
};

module.exports = App;

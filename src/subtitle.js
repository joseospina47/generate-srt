const moment = require('moment');
const durationFormatSetup = require('moment-duration-format');
const trim = require('trim');

const files = require('../util/files');

durationFormatSetup(moment);

const countWords = text => {
  let string = text;
  string = string.replace(/\n/g, ' ');
  string = string.replace(/(^\s*)|(\s*$)/gi, '');
  string = string.replace(/[ ]{2,}/gi, ' ');
  return string.split(' ').length;
};

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

const subtitles = [];

const Subtitle = {
  formatSubtitles: (transcription, casing) => {
    const correctedTimeStamps = [];
    const subtitle = {
      id: '0',
      startTime: '',
      endTime: '',
      text: ''
    };

    transcription.forEach((info, i) => {
      const alternatives = info.results[0].alternatives[0];
      const timeStamps = alternatives.timestamps;
      const textItem = alternatives.transcript;

      if (alternatives.confidence > 0.0) {
        for (let j = 0; j < timeStamps.length; ++j) {
          if (countWords(timeStamps[j][0]) === 1) {
            correctedTimeStamps.push(timeStamps[j]);
          } else {
            const start = timeStamps[j][1];
            const end = timeStamps[j][2];
            const words = timeStamps[j][0].split(' ');

            for (let k = 0; k < words; ++k) {
              correctedTimeStamps.push([words[k], start, end]);
            }
          }
        }
        subtitle.id = String(i + 1);

        if (casing) {
          subtitle.text = `${capitalize(trim(textItem))}.`;
        } else {
          subtitle.text = textItem;
        }

        subtitle.startTime = moment
          .duration(timeStamps[0][1], 'seconds')
          .format('hh:mm:ss,SSS', {
            trim: false
          });
        subtitle.endTime = moment
          .duration(timeStamps[timeStamps.length - 1][2], 'seconds')
          .format('hh:mm:ss,SSS', {
            trim: false
          });

        subtitles.push({ ...subtitle });
      }
    });
    return subtitles;
  },
  getTranslatedSubs: translations =>
    subtitles.map((item, index) => ({
      ...item,
      text: translations[index]
    })),
  writeSrtFile: (filename, srtInfo) =>
    files.write(`output/${files.name(filename)}.srt`, srtInfo)
};

module.exports = Subtitle;

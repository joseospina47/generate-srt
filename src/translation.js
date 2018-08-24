const Translate = require('@google-cloud/translate');

const translate = new Translate();

const Translation = {
  getTranslation: (text, target) =>
    new Promise((resolve, reject) => {
      translate
        .translate(text, target)
        .then(results => {
          const translation = results[0];
          resolve(translation);
        })
        .catch(err => {
          reject(err);
        });
    })
};

module.exports = Translation;

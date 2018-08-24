const fs = require('fs');
const path = require('path');

const Files = {
    fileExists: route => {
      try {
        return fs.statSync(filePath).isFile();
      } catch (err) {
        return false;
      }
    },
    size: route => {
      try {
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const size = fs.statSync(route).size;
        const exponent = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, exponent)).toFixed(2) + ' ' + units[exponent];
      }
      catch (err) {
        throw err;
      }
    },
    read: route => {
      try {
        return fs.readFileSync(route, 'utf8');
      } catch (err) {
        throw err;
      }
    },
    write: (filePath, content) => {
      try {
        return fs.writeFileSync(filePath, content, 'utf8');
      } catch (err) {
        throw err;
      }
    },
    stream: route => {
      try {
        return fs.createReadStream(route);
      } catch(err) {
        throw err;
      }
    },
    name: route => path.parse(route).name,
    extension:  route => path.parse(route).ext
};

module.exports = Files;

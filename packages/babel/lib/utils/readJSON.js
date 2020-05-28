const fs = require('fs');

function readJSON(srcPath) {
    return JSON.parse(fs.readFileSync(srcPath, { encoding: 'utf8' }));
}

module.exports = readJSON;

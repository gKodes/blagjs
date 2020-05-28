import codegen from 'babel-plugin-codegen/macro';

codegen`
const fs = require('fs');
// const fs = require('fs');
const path = require('path');

const components = fs.readdirSync(__dirname, { withFileTypes: true })
   .filter(fileType => ((fileType.isFile() || fileType.isDirectory()) && fileType.name !== path.basename(__filename)));

module.exports = components.map(file => "export * from './" + file.name  + "'").join('\\r\\n');
`;

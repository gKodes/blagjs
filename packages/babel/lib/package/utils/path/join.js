const upath = require('upath');
const { withTailSepAsIs } = require('./trailingSlash');

const join = withTailSepAsIs(upath.join);

module.exports = { join };

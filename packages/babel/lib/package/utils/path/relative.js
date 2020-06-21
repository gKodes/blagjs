const upath = require('upath');
const { withTailSepAsIs } = require('./trailingSlash');

const relative = withTailSepAsIs(upath.relative);

module.exports = { relative };

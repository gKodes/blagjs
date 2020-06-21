function isConditionalDotExportSugar(exports, basePath) {
  if (typeof exports === 'string') return true;
  if (Array.isArray(exports)) return true;
  if (typeof exports !== 'object') return false;


  // TODO: Maybe we dont need this, we can support both . and no . keys
  let isConditional = false;
  let firstCheck = true;
  for (const key of Object.keys(exports)) {
    const curIsConditional = key[0] !== '.';
    if (firstCheck) {
      firstCheck = false;
      isConditional = curIsConditional;
    } else if (isConditional !== curIsConditional) {
      throw new ERR_INVALID_PACKAGE_CONFIG(
        basePath,
        '"exports" cannot ' +
          "contain some keys starting with '.' and some not. The exports " +
          'object must either be an object of package subpath keys or an ' +
          'object of main entry condition name keys only.'
      );
    }
  }
  return isConditional;
}

module.exports = { isConditionalDotExportSugar };

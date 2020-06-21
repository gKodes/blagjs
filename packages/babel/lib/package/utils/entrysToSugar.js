const PKG_ENTRYS = {
  require: ['main'],
  import: ['module', 'main'],
  browser: ['browser', 'main'],
};

const STR_PATH = './';
const PKG_ENTRY_TARGETS = Object.keys(PKG_ENTRYS);

function entrysToSugar(pkgJson) {
  const result = {};
  let hasEntrys = false;

  for(let entryTarget of PKG_ENTRY_TARGETS) {
    for(let entryAttr of PKG_ENTRYS[entryTarget]) {
      const attrValue = pkgJson[entryAttr];
      if ( typeof attrValue === 'string' ) {
        result[entryTarget] = attrValue;
        hasEntrys = true;
      }

      if ( attrValue !== true ) {
        break;
      }
    }
  }
  return (hasEntrys && result) || STR_PATH;
}

module.exports = { entrysToSugar };

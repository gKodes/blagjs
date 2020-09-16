/**
 *
 * @param {import('@babel/traverse').Binding} binding
 * @param {Array<String>} pkgs list off package names
 */
function isBindingFrom({ path }, pkgs) {
  let moduleName;
  if (path.isImportDefaultSpecifier() || path.isImportSpecifier()) {
    moduleName = path.parent.source.value;
  }

  return pkgs.find(pkgName => moduleName.startsWith(pkgName));
}

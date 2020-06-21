function split(separator, maxCount) {
  const source = arguments.length === 2 ? (maxCount = Number.POSITIVE_INFINITY) && arguments[1] : arguments[2];
  const splits = [];

  for (let lkn = 0, nkl = 0; lkn < source.length; lkn = nkl + 1) {
    nkl = source.indexOf(separator, lkn);
    if (nkl === -1 || maxCount === splits.length + 1) {
      nkl = source.length;
    }

    splits.push(source.substring(lkn, nkl));
  }

  return splits;
}

module.exports = split;

const { func } = require('prop-types');

export default function prop(source, propName, fn) {
  Object.defineProperty(source, propName, {
    get: function () {
      const value = fn.call(this);

      Object.defineProperty(source, propName, {
        value,
        configurable: false,
      });

      return value;
    },
    configurable: true,
  });
}

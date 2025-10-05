// Polyfills for regenerator runtime
if (typeof global === 'undefined') {
  var global = globalThis;
}

if (typeof global.regeneratorRuntime === 'undefined') {
  global.regeneratorRuntime = require('regenerator-runtime/runtime');
}

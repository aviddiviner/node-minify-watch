const minifyWatch = require('./node-minify-watch').watch;
const minifyOnce = require('./node-minify-watch').once;
const path = require('path');

minifyWatch({
  watch: 'test-fixtures/js',
  recursive: true,
  type: 'gcc',  // gcc, yui-js, uglifyjs, no-compress
  language: 'ECMASCRIPT5',
  fileIn: 'test-fixtures/js/**/*.js',
  fileOut: 'test-fixtures/out/all.js',
});

minifyWatch({
  watch: 'test-fixtures/css',
  recursive: true,
  type: 'yui',  // yui|yui-css, sqwish, clean-css, csso, no-compress
  fileIn: 'test-fixtures/css/**/*.css',
  fileOut: 'test-fixtures/out/all.css',
});

minifyOnce({
  type: 'gcc',  // gcc, yui-js, uglifyjs, no-compress
  fileIn: [
    'test-fixtures/bower/foo.js',
  ],
  fileOut: (f) => 'test-fixtures/out/' + path.basename(f),
});

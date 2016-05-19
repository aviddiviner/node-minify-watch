const minifyWatch = require('./node-minify-watch').watch;
const minifyOnce = require('./node-minify-watch').once;
const path = require('path');

// This takes all .js files (the glob on fileIn) and compiles them to all.js
// (fileOut) on any change in the watched folder.
minifyWatch({
  watch: 'test-fixtures/js',
  recursive: true,
  type: 'gcc',  // gcc, yui-js, uglifyjs, no-compress
  language: 'ECMASCRIPT5',
  fileIn: 'test-fixtures/js/**/*.js',
  fileOut: 'test-fixtures/out/all.js',
});

// This takes any .css file in the watched folder and compiles it to a file of
// the same name in the out folder on any change.
minifyWatch({
  watch: 'test-fixtures/css',
  type: 'yui',  // yui|yui-css, sqwish, clean-css, csso, no-compress
  // fileIn defaults to the file that was modified. We can also use a function
  // here, e.g. `fileIn: (f) => f.endsWith('.css') ? f : null,`
  fileOut: (f) => 'test-fixtures/out/' + path.basename(f),
});

// This does a once-off minify when run, on some .js libs or whatever.
minifyOnce({
  type: 'gcc',  // gcc, yui-js, uglifyjs, no-compress
  fileIn: [
    'test-fixtures/bower/foo.js',
  ],
  fileOut: (f) => 'test-fixtures/out/' + path.basename(f),
});

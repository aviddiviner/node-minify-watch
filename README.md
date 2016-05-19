# node-minify-watch

A very simple [node.js](https://nodejs.org/) module which watches the filesystem for changes and triggers [node-minify](https://github.com/srod/node-minify).

## Usage

This will watch for changes to files in `assets/js` and then minify those out to the `public` folder.

```javascript
const minifyWatch = require('node-minify-watch').watch;
const path = require('path');

minifyWatch({
  watch: 'assets/js',
  recursive: true,
  type: 'gcc',  // gcc, yui-js, uglifyjs, no-compress
  language: 'ECMASCRIPT5',
  fileOut: (f) => 'public/' + path.basename(f),
});
```

The options that this module checks are:

- `watch` (string): Target path to watch for file changes
- `recursive` (boolean): Check for file changes in subfolders

The rest of the options are passed to [node-minify](https://github.com/srod/node-minify).  Take a look at [test.js](test.js) for more examples.

***Note:** Be careful not to output to the same folder that you are watching, as it could cause an infinite loop!*

## See Also

You should probably rather be using one of these:

- [babel](https://babeljs.io/)
- [webpack](http://webpack.github.io/)

## License

[MIT](LICENSE)

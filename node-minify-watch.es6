const fs = require('fs');
const path = require('path');
const compressor = require('node-minify');

function ts() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

// -----------------------------------------------------------------------------

var watchCounter = 1;

exports.watch = function(opts) {
  var watch = watchCounter++;
  var runCounter = 1;
  opts.recursive = opts.recursive || false;
  var root = opts.watch;
  fs.accessSync(root, fs.R_OK);  // check read access
  fs.watch(root, {recursive: opts.recursive}, (event, filename) => {
    var log = function(msgtype, args) {
      var msg = Array.prototype.slice.call(arguments, 1).join(' ');
      console.log(ts(), '(watch:' + watch + ' ' + msgtype + ')', event, '[', root, filename, ']', msg);
    }
    if (filename) {
      var fullpath = path.join(root, filename);
      fs.access(fullpath, fs.R_OK, (err) => {
        if (err) {
          log('skip:noread');
        } else {
          var runOpts = Object.assign({}, opts);
          if (typeof runOpts.fileIn === 'function')  runOpts.fileIn  = runOpts.fileIn(fullpath);
          if (typeof runOpts.fileIn === 'undefined') runOpts.fileIn  = fullpath;
          if (typeof runOpts.fileOut === 'function') runOpts.fileOut = runOpts.fileOut(fullpath);
          if (typeof runOpts.options === 'function') runOpts.options = runOpts.options(fullpath);
          if (runOpts.fileIn && runOpts.fileOut) {
            var i = runCounter++;
            runOpts.callback = function(err, min) {
              if (err) {
                log('run:' + i, 'error:', err);
              } else {
                log('run:' + i, '(built) ->', this.fileOut);
              }
            }
            log('run:' + i, runOpts.fileIn, '-> (building...)');
            new compressor.minify(runOpts);
          } else {
            log('skip');
          }
        }
      });
    } else {
      log('skip:nofile');
    }
  });
  var showOpts = Object.assign({}, opts);
  if (typeof showOpts.fileIn === 'function')  showOpts.fileIn = showOpts.fileIn.toString();
  if (typeof showOpts.fileOut === 'function') showOpts.fileOut = showOpts.fileOut.toString();
  console.log('watch:' + watch, showOpts);
}

// -----------------------------------------------------------------------------

var onceCounter = 1;

exports.once = function(opts) {
  opts.fileIn.forEach((srcpath) => {
    var build = onceCounter++;
    var log = function(args) {
      var msg = Array.prototype.slice.call(arguments).join(' ');
      console.log(ts(), '(minify:' + build + ')', '[', srcpath, ']', msg);
    }
    fs.accessSync(srcpath, fs.R_OK);
    var runOpts = Object.assign({}, opts);
    runOpts.fileIn = srcpath;
    if (typeof runOpts.fileOut === 'function') runOpts.fileOut = runOpts.fileOut(srcpath);
    if (typeof runOpts.options === 'function') runOpts.options = runOpts.options(srcpath);
    var destpath = runOpts.fileOut;
    fs.access(destpath, fs.F_OK, (err) => {
      if (err) {
        runOpts.callback = function(err, min) {
          if (err) {
            log('error:', err);
          } else {
            log('(built) ->', this.fileOut);
          }
        }
        log(runOpts.fileIn, '-> (build)');
        new compressor.minify(runOpts);
      } else {
        log('skip:exists', destpath);
      }
    });
  });
}

const _ = require('highland');
const fs = require('fs');
const path = require('path');
const compressor = require('node-minify');

var watchCounter = 1;

// var exports = module.exports = {};
exports.watch = function(opts) {
  var watch = watchCounter++;
  var runCounter = 1;
  opts.recursive = opts.recursive || false;
  var root = opts.watch;
  fs.accessSync(root, fs.R_OK);  // check read access
  fs.watch(root, {recursive: opts.recursive}, (event, filename) => {
    var log = function(msgtype, args) {
      var ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      var msg = Array.prototype.slice.call(arguments, 1).join(' ');
      console.log(ts, '(watch:' + watch + ' ' + msgtype + ')', event, '[', root, filename, ']', msg);
    }
    if (filename) {
      var fullpath = path.join(root, filename);
      fs.access(fullpath, fs.R_OK, (err) => {
        if (err) {
          log('skip:noread');
        } else {
          var runOpts = _.extend(opts, {});
          if (typeof runOpts.fileIn === 'function')  runOpts.fileIn  = runOpts.fileIn(fullpath);
          if (typeof runOpts.fileOut === 'function') runOpts.fileOut = runOpts.fileOut(fullpath);
          if (runOpts.fileIn && runOpts.fileOut) {
            var i = runCounter++;
            runOpts.callback = function(err, min) {
              if (err) {
                log('run:' + i, 'error:', err);
              } else {
                log('run:' + i, '(built) ->', this.fileOut);
              }
            }
            log('run:' + i, runOpts.fileIn, '-> (build)');
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
  var showOpts = _.extend(opts, {});
  showOpts.fileIn = showOpts.fileIn.toString();
  showOpts.fileOut = showOpts.fileOut.toString();
  console.log('watch:' + watch, showOpts);
}

// -----------------------------------------------------------------------------

var miniCounter = 1;

exports.minify = function(opts) {
  opts.fileIn.forEach((filepath) => {
    var build = miniCounter++;
    var log = function(args) {
      var ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      var msg = Array.prototype.slice.call(arguments).join(' ');
      console.log(ts, '(minify:' + build + ')', '[', filepath, ']', msg);
    }
    fs.access(filepath, fs.R_OK, (err) => {
      if (err) {
        var runOpts = _.extend(opts, {});
        runOpts.fileIn = filepath;
        if (typeof runOpts.fileOut === 'function') runOpts.fileOut = runOpts.fileOut(filepath);
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
        log('skip');
      }
    });
  });
}

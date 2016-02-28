// provides a few helper methods for parsing folders/files

var fs = require('fs');
var path = require('path');

var method = FileUtilities.prototype;

function FileUtilities() {
};

// get all files under a folder
method.walk = function (dir, returnHandler, returnParams) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return returnHandler(err,returnParams);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return returnHandler(null, results,returnParams);
      file = dir + '/' + file;
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          method.walk(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

// grab only folders
// TODO this maybe the only sync code in the project
method.getDirectories = function (srcpath) {
  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};


module.exports = FileUtilities;
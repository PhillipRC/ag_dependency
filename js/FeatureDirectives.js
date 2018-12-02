// holds the functionality to find directives within features

var fs = require('fs');
var FileUtilities = require("./FileUtilities.js");
var Directive = require("./Directive.js");
var LoadingQueue = require("./LoadingQueue.js");

var method = FeatureDirectives.prototype;

function FeatureDirectives(appPath) {

  // define what is needed to find feature directives
  this.def = {
    path: appPath + '/ag-app/app/scripts/features',
    file: '.js',
    re: /\.directive\(\'.*?\'/g
  };

  // reference to file utilities
  this.fileUtilities = new FileUtilities();

  // list of feature directives
  this.list = [];

  // array of FeatureDirective objects
  this.reportEntities = [];

  // file list for feature
  this.fileList = [];

  // files that may contain directives
  this.htmlFileList = [];

  // directives used in feature
  this.childFeatures = [];

  // list of feature associated with directive
  this.featureList = [];

}

// load list of features
method.loadList = function (returnHandler) {

  var reportEntities = this.reportEntities;
  var def = this.def;
  var list = this.list;
  var jsFileList = [];
  var featureList = this.featureList;

  this.fileUtilities.walk(def.path, function (err, results) {
    if (err) throw err;

    // grab list of js and template files
    for (var idx = 0; idx < results.length; idx++) {
      if (results[idx].indexOf(def.file) != -1) {
        jsFileList.push(results[idx]);
      }
    }

    // load each file looking for directive definitions
    var filesLoaded = 0;
    for (var jsFileListIdx = 0; jsFileListIdx < jsFileList.length; jsFileListIdx++) {

      var readFile = function(path) {

        fs.readFile(jsFileList[jsFileListIdx], function (err, data) {
          if (err) {
            throw err;
          }

          filesLoaded++;

          var fileContents = data.toString();
          var directivesFound = fileContents.match(def.re);

          if (directivesFound) {
            for (var idx = 0; idx < directivesFound.length; idx++) {

              // parse the directive title
              var directiveStart = directivesFound[idx].indexOf("'") + 1;
              var directiveEnd = directivesFound[idx].indexOf("'", directiveStart);
              var directive = directivesFound[idx].substring(directiveStart, directiveEnd);

              // get feature name
              var re = /\/features\/(.*?)\//g;

              var featureName = re.exec(path)[1];
              featureList.push(featureName);

              // add directive
              list.push(directive);

            }
          }

          // done processing go on to the next step
          if (filesLoaded === jsFileList.length) {

            // build report entities
            for (var idx = 0; idx < list.length; idx++) {
              var directive = new Directive(list[idx], (def.path + '/' + list[idx]),featureList[idx]);
              reportEntities.push(directive);
            }

            returnHandler();
          }

        });

      };

      readFile(jsFileList[jsFileListIdx]);

    }

  });

};

module.exports = FeatureDirectives;
// holds the functionality to find directives within features

var fs = require('fs');
var FileUtilities = require("./FileUtilities.js");
var Directive = require("./Directive.js");

var method = Directives.prototype;

function Directives(appPath, type) {

  var types = {

    'directives': {
      path: appPath + '/ag-app/app/scripts/components/directives',
      file: '.js',
      feature: false,
      re: /\.directive\(\'.*?\'/g
    },

    'feature-directives': {
      path: appPath + '/ag-app/app/scripts/features',
      file: '.js',
      feature: true,
      re: /\.directive\(\'.*?\'/g
    },

    'components': {
      path: appPath + '/ag-app/app/scripts/components/directives',
      file: '.js',
      feature: false,
      re: /\.component\(\'.*?\'/g
    },

    'feature-components': {
      path: appPath + '/ag-app/app/scripts/features',
      file: '.js',
      feature: true,
      re: /\.component\(\'.*?\'/g
    }

  };

  // define what is needed to find directives
  this.def = types[type];

  // reference to file utilities
  this.fileUtilities = new FileUtilities();

  // list of feature directives
  this.list = [];

  // output
  this.reportEntities = [];

  // files that may contain directives
  this.htmlFileList = [];

  // collection of dependants (report entities)
  this.dependents = [];

}

// load list of features
method.loadReportEntities = function (returnHandler) {

  var def = this.def;
  var jsFileList = [];
  var list = [];
  var pathList = [];
  var reportEntities = this.reportEntities;

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

      var readFile = function (path) {

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


              // push path
              pathList.push(path);

              // add directive
              list.push(directive);

            }
          }

          // done processing go on to the next step
          if (filesLoaded === jsFileList.length) {

            // build report entities
            for (var idx = 0; idx < list.length; idx++) {

              var featureName;

              if (def.feature) {
                // get feature name
                var re = /\/features\/(.*?)\//g;
                featureName = re.exec(pathList[idx])[1];
              }


              var directive = new Directive(list[idx], (pathList[idx]), featureName);
              reportEntities.push(directive);
            }

            console.log('Directives: ' + reportEntities.length);

            returnHandler();
          }

        });

      };

      readFile(jsFileList[jsFileListIdx]);

    }

  });

};

module.exports = Directives;
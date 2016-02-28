// holds the functionality to find directives

var fs = require('fs');
var FileUtilities = require("./FileUtilities.js");
var Directive = require("./Directive.js");

var method = Directives.prototype;

function Directives(appPath) {

  // define what is needed to find directives
  this.def = {
    path: appPath + '/ag-app/app/scripts/components/directives',
    file: '.js',
    re: /directive\(\'ag.*?\'/g
  };

  // reference to file utlities
  this.fileUtilities = new FileUtilities();

  // list of directives
  this.list = [];

  // array of Directive objects
  this.reportEntities = [];

  // file list for feature
  this.fileList = [];

  // files that may contain directives
  this.htmlFileList = [];

  // directives used in feature
  this.childFeatures = [];

}

// load list of directives
method.loadList = function(returnHandler) {

  var reportEntities = this.reportEntities;
  var def = this.def;
  var list = this.list;

  var jsFileList = [];

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
    for (var idx = 0; idx < jsFileList.length; idx++) {

      fs.readFile(jsFileList[idx], function (err, data) {
        if (err) {
          throw err;
        }

        filesLoaded++;

        var fileContents = data.toString();
        var directivesFound = fileContents.match(def.re);

        if (directivesFound)
          for (var idx = 0; idx < directivesFound.length; idx++) {

            // parse the directive title
            var directiveStart = directivesFound[idx].indexOf("'") + 1;
            var directiveEnd = directivesFound[idx].indexOf("'", directiveStart);
            var directive = directivesFound[idx].substring(directiveStart, directiveEnd);

            // add directive
            list.push(directive);

          }

        // done processing go on to the next step
        if (filesLoaded === jsFileList.length) {

          // build report entities
          for (var idx = 0; idx < list.length; idx++)
            reportEntities.push(new Directive(list[idx], (def.path + '/' + list[idx])));

          returnHandler();
        }

      });

    }

  });

};

module.exports = Directives;
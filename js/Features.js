// holds the functionality to find features and associated directives

var fs = require('fs');
var FileUtilities = require("./FileUtilities.js");
var Feature = require("./Feature.js");
var LoadingQueue = require("./LoadingQueue.js");

var method = Features.prototype;

function Features(appPath) {

  // define what is needed to find features
  this.def = {
    path: appPath + '/ag-app/app/scripts/features',
    file: '.html'
  };

  // reference to file utilities
  this.fileUtilities = new FileUtilities();

  // list of features
  this.list = [];

  // array of Feature objects
  this.reportEntities = [];

}

// load list of features
method.loadList = function (returnHandler) {

  var list = this.list;
  var def = this.def;

  // all the directories in the features folder are Features
  var items = this.fileUtilities.getDirectories(def.path);
  for (var idx = 0; idx < items.length; idx++) {
    list.push(items[idx]);
  }

  // build report entities
  for (var idx = 0; idx < list.length; idx++)
    this.reportEntities.push(new Feature(list[idx], (def.path + '/' + list[idx])));

  // call return handler
  returnHandler();

};

// load up the reportEntities with some sweet sweet directive data
method.setDependents = function (directives, returnHandler) {

  var reportEntities = this.reportEntities;
  var def = this.def;

  // examine each file looking for directives
  var findDirectives = function (id, returnHandler) {

    // load each file looking for directive definitions
    var filesLoaded = 0;
    for (var idx = 0; idx < reportEntities[id].htmlFileList.length; idx++) {

      fs.readFile(reportEntities[id].htmlFileList[idx], function (err, data) {
        if (err) {
          throw err;
        }

        filesLoaded++;

        var fileContents = data.toString();

        // loop over directives
        for (var directivesIdx = 0; directivesIdx < directives.reportEntities.length; directivesIdx++) {

          var reAttribute = RegExp(directives.reportEntities[directivesIdx].getAsTagAttribute());
          var directivesFound = fileContents.match(reAttribute);

          if (directivesFound) {
            for (var idx = 0; idx < directivesFound.length; idx++) {
              directives.reportEntities[directivesIdx].info.push('reference: ' + reportEntities[id].htmlFileList[idx]);
              reportEntities[id].dependents.push(directives.reportEntities[directivesIdx]);
            }
          }

        }

        // done processing go on to the next step
        if (filesLoaded === reportEntities[id].htmlFileList.length) {
          returnHandler({id: id});
        }

      });

    }

    // if there are no html files
    if (reportEntities[id].htmlFileList.length === 0) {
      returnHandler({id: id});
    }


  };

  // call the return handler when all is said and done
  var doneLoadingHandler = function() {
    returnHandler();
  };
  var loadingQueue = new LoadingQueue(doneLoadingHandler);

  // handle return from directory walks
  var walkHandler = function (err, results, returnParams) {
    if (err) throw err;

    // save the list
    reportEntities[returnParams.id].fileList = results;

    // pair down results to def.file type
    var walkReturn = [];
    for (walkIdx = 0; walkIdx < results.length; walkIdx++)
      if (results[walkIdx].indexOf(def.file) != -1)
        walkReturn.push(results[walkIdx]);

    // save the list
    reportEntities[returnParams.id].htmlFileList = walkReturn;

    // we have what is needed to load up the reportEntity with associated directive data
    findDirectives(returnParams.id, function(){loadingQueue.remove()});
  };

  // go through each reportEntities
  loadingQueue.add(reportEntities.length);
  for (var featureIdx = 0; featureIdx < reportEntities.length; featureIdx++) {
    // kick off a dir walk of each feature
    this.fileUtilities.walk(reportEntities[featureIdx].path, walkHandler, {id: featureIdx});
  }

};

module.exports = Features;
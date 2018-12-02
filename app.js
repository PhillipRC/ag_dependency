// application starting point

// TODO directives:directives
// TODO directive:controllers
// TODO services:API
// TODO directive:templates
// TODO API:SQL
// TODO API:SOLR
// TODO API:Drupal
// TODO Drupal:????

var fs = require('fs');
var path = require('path');
var Features = require("./js/Features.js");
var FeatureDirectives = require("./js/FeatureDirectives.js");
var Directives = require("./js/Directives.js");
var LoadingQueue = require("./js/LoadingQueue.js");
var Report = require("./js/Report.js");

console.log ('ag_dependency');

// check for path to source
if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " path/to/hallways (/var/www/hallways/hallways)");
  process.exit(-1);
}

// hallways (hopefully) app path
var appPath = process.argv[2];
var reportDataDestination = './dependencyReport.json';
var reportMDDestination = './report.md';

// generate report data
var saveReportData = function () {

  // concat the reportEntities
  var reportData = [];
  reportData.push.apply(reportData, features.reportEntities);
  reportData.push.apply(reportData, directives.reportEntities);
  reportData.push.apply(reportData, featureDirectives.reportEntities);

  // write out the file
  fs.writeFileSync(reportDataDestination, JSON.stringify(reportData), 'utf-8');
  console.log ('Report Data - Saved: ' + reportDataDestination);

  // generate markdown
  var report = new Report(reportData);
  md = report.generateMarkDown();
  fs.writeFileSync(reportMDDestination, md, 'utf-8');
  console.log ('Report - Mark Down Saved: ' + reportMDDestination);

};

// load features with associated directives
// generate report and graph data
var doneLoadingDependents = function () {
  console.log('Features - Dependents - Done Loading');
  saveReportData();
};
var loadingDependentsQueue = new LoadingQueue(doneLoadingDependents);
var loadFeatureDependents = function () {

  console.log('Features - Dependents - Loading');

  loadingDependentsQueue.add();
  features.setDependents(directives, function() {loadingDependentsQueue.remove();});

  loadingDependentsQueue.add();
  features.setDependents(featureDirectives, function() {loadingDependentsQueue.remove();});

};

// set up loading queue for directives and features
var doneLoadingHandler = function () {
  console.log('============= Set Dependents');
  // done loading all the entities
  loadFeatureDependents();
};
var loadingQueue = new LoadingQueue(doneLoadingHandler);

console.log('============= Load Entities');

// load directives
var directives = new Directives(appPath);
var directiveReturnHandler = function () {
  console.log('Directives: ' + directives.reportEntities.length);
  loadingQueue.remove();
};
loadingQueue.add();
directives.loadList(directiveReturnHandler);

// load features
var features = new Features(appPath);
var featuresReturnHandler = function () {
  console.log('Features: ' + features.reportEntities.length);
  loadingQueue.remove();
};
loadingQueue.add();
features.loadList(featuresReturnHandler);

// load feature directives
var featureDirectives = new FeatureDirectives(appPath);
var featureDirectivesReturnHandler = function () {
  console.log('Feature Directives: ' + featureDirectives.reportEntities.length);
  loadingQueue.remove();
};
loadingQueue.add();
featureDirectives.loadList(featureDirectivesReturnHandler);
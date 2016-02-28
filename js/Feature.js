// defines information collected on a feature

var method = Feature.prototype;

// TODO create a ReportEntity class
Object.defineProperties(method, {
  "nameDisplay": {
    "get": function () {
      return this._nameDisplay;
    },
    "set": function (val) {
      this.name = val;
      this._nameDisplay = val;
      this.nameFull = (this.type + '.' + this.name);
    }
  }
});

function Feature(name, path) {

  // entity type
  this.type = 'feature';

  // name prefixed with entity type
  this.nameFull;

  // title
  this.nameDisplay = name;

  // path to entity
  this.path = path;

  // file list (full)
  this.fileList = [];

  // files that may contain useful data
  this.htmlFileList = [];

  // collection of dependants (report entities)
  this.dependents = [];

  // extra important information for reporting
  this.info = [];
}

module.exports = Feature;
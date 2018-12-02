// defines information collected on a directive

var method = Directive.prototype;

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

String.prototype.toDash = function () {
  return this.replace(/([A-Z])/g, function ($1) {
    return "-" + $1.toLowerCase();
  });
};

/**
 *
 * @param {string} name - Directive name
 * @param {string} path - Path to file
 * @param {string=} feature - Associated feature
 * @constructor
 */
function Directive(name, path, feature) {

  // entity type
  this.type = 'directive';

  // name
  this.nameFull;

  // feature
  this.feature = ((feature != undefined) ?  feature : '');

  // title
  if( this.feature !== '') {
    this.nameDisplay = this.feature + ' ' + name;
    this.type = 'feature-directive';
  } else {
    this.nameDisplay = name;
  }

  // path to entity
  this.path = path;

  // collection of dependants (report entities)
  this.dependents = [];

  // extra important information for reporting
  this.info = [];

}

method.getAsTagAttribute = function () {
  return this.nameDisplay.toDash();
};

method.getDependencyName = function () {
  return this.nameFull;
};

module.exports = Directive;
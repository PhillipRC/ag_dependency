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

function Directive(name, path) {

  // entity type
  this.type = 'directive';

  // name prefixed with entity type
  this.nameFull;

  // title
  this.nameDisplay = name;

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
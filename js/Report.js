// provides a text based report

var method = Report.prototype;

function Report(reportData) {

  this.reportData = reportData;
  this.reportHeader = 'ag_dependencey';
  this.reportSummary = 'This is a display of the results from the file analysis done by ag_dependency.';

}

// generate a mark down version of the data
method.generateMarkDown = function () {

  var md = '';
  var rtn = '\r\n';

  // TODO this should be defined some place else
  var entityTypes =
    [
      {type: 'feature', displayName: 'Features'},
      {type: 'directive', displayName: 'Directives'}
    ];

  // recursively report on dependents
  var reportOnEntity = function (type, data, level) {

    var rtnValue = '';

    for (var featureIdx = 0; featureIdx < data.length; featureIdx++) {

      if (data[featureIdx].type === type) {

        var displayName = data[featureIdx].name;

        // bold name if its lvl 1
        if (level === 0) {

          displayName = '**' + data[featureIdx].name + '**' + ' - ' + data[featureIdx].path;

        }

        var indent = Array(level + 1).join('  ');
        rtnValue += ( indent + '* ' + displayName + rtn);

        // report on and extra 'info'
        var indentInfo = Array(level + 2).join('  ');
        for (var idx = 0; idx < data[featureIdx].info.length; idx++) {
          rtnValue += ( indentInfo + '* ' + data[featureIdx].info[idx] + rtn);
        }


        // report on dependents
        if (data[featureIdx].dependents.length) {

          // bomb out if it gets too deep
          if (level > 3) return;

          // report on all types of dependents
          for (var idx = 0; idx < entityTypes.length; idx++) {
            rtnValue += reportOnEntity(entityTypes[idx].type, data[featureIdx].dependents, (level + 1));
          }
        }
      }

    }

    return (rtnValue + rtn);

  };

  // header
  md += ('## ' + this.reportHeader + rtn);
  md += (this.reportSummary + rtn);

  // body
  for (var idx = 0; idx < entityTypes.length; idx++) {
    md += ('## ' + entityTypes[idx].displayName + rtn);
    md += reportOnEntity(entityTypes[idx].type, this.reportData, 0);
  }

  return md;

};

module.exports = Report;
# ag_dependency

Generates a report and aggregate data detailing entity dependencies. AG source code is analyzed to generate the results.

## Installation

Prerequisites: [node.js](https://nodejs.org/en/), [requirejs](http://requirejs.org/)

* ag source code
  * git clone https://github.com/GSA/CAP-ACQUISITION_GATEWAY.git
* ag_dependence code
  * git clone https://github.com/PhillipRC/ag_dependency.git

## Execution

* node [path to ag_dependency]app.js [path to hallways]
  * node app.js /var/www/hallways/hallways/

## Output

**dependencyReport.json**

* [raw report data](https://github.com/PhillipRC/ag_dependency/blob/master/dependencyReport.json)

**report.md**

* [text report](https://github.com/PhillipRC/ag_dependency/blob/master/report.md)

**index.html**

* [graphic report](http://bl.ocks.org/PhillipRC/raw/cbbcf6ff5b3efcee06fe/)

**console**

    node app.js ../ag/app/CAP-ACQUISITION_GATEWAY/hallways
    ag_dependency
    ============= Load Entities
    Features: 25
    Directives: 88
    Directives: 1
    Directives: 5
    Directives: 29
    ============= Set Dependents
    Features - Dependents - Loading
    Features - Dependents - Done Loading
    Report Data - Saved: ./dependencyReport.json
    Report - Mark Down Saved: ./report.md




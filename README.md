# ag_dependency

Generates a report and aggregate data detailing entity dependencies. AG source code is analyzed to generate the results.

## Installation

Prerequisites: [node.js](https://nodejs.org/en/), [requirejs](http://requirejs.org/)

* ag source code
  * git clone https://github.com/GSA/CAP-ACQUISITION_GATEWAY.git
* ag_dependence code
  * git clone https://github.com/PhillipRC/ag_dependence.git

## Execution

* node [path to ag_dependency]app.js [path to hallways]
  * node app.js /var/www/hallways/hallways/

## Output

**dependence.json**

* [raw report data](https://github.com/PhillipRC/ag_dependence/blob/master/dependenceReport.json)

**report.md**

* [text report](https://github.com/PhillipRC/ag_dependence/blob/master/report.md)

**index.html**

* graphic report

**console**

    node app.js /var/www/hallways/hallways/
    ag_dependence
    Directives - Loading
    Features - Loading
    Features - Done Loading: Found 9
    Directives - Done Loading: Found 44
    Features - Dependents - Loading
    Features - Dependents - Done Loading
    Report Data - Saved: ./dependenceReport.json
    Report - Mark Down Saved: ./report.md
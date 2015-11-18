<p align="center">
    <img height="240" width="235" src="https://github.com/ramsunvtech/apicluster/raw/master/api-cluster.png">
</p>

# Api Cluster
**API Endpoint Library**

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url]
<!--[![Coverage Status](https://coveralls.io/repos/ramsunvtech/apicluster/badge.svg?branch=master&service=github)](https://coveralls.io/github/ramsunvtech/apicluster?branch=master) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ramsunvtech/apicluster?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)-->

[![NPM](https://nodei.co/npm/apicluster.png?downloads=true&downloadRank=true)](https://nodei.co/npm/apicluster/)

[downloads-image]: http://img.shields.io/npm/dm/apicluster.svg
[npm-url]: https://npmjs.org/package/apicluster
[npm-image]: http://img.shields.io/npm/v/apicluster.svg

[travis-url]: https://travis-ci.org/ramsunvtech/apicluster
[travis-image]: http://img.shields.io/travis/ramsunvtech/apicluster.svg

## What is API Cluster?

API Cluster is a API Endpoint Utility Library that will help you organizing the Endpoints in one stop place and add multiple groups for versionzing, if you are depend on API Serving Team.

API Cluster lets you quit messing with concatenation on URL and their values and it will be available in (Node) Server side and browser) Client Side.

# Getting Started

#### 1. Install api cluster globally (server side) or add the apicluster.js in your file.

```sh
$ npm install --global apicluster
```

#### 2. Create Config and define endpoints.

```javascript
ApiCluster
  .defaults({
      name: 'mydefault',

      config: {
        'employee': 'emp',
        'details': 'details',
        'timesheet': 'timesheet'
      },

      endpoints: {
        "empDetails": "_employee_/_details_/:empId/profile"
      }
  });
```

#### 2. Add multiple groups.
```javascript
ApiCluster
  .defaults({
      name: 'mydefault',

      config: {
        'employee': 'emp',
        'details': 'details',
        'timesheet': 'timesheet'
      },

      endpoints: {
        "empDetails": "_employee_/_details_/:empId/profile"
      }
  })
  .addAnother({
      name: 'v1',

      config: {
        'employee': 'emp/v1',
        'details': 'detailed',
        'timesheet': 'timesheet'
      },

      endpoints: {
        "empDetails": "_employee_/_details_/:empId/profile"
      }
  })
  .addAnother({
      name: 'v2',

      config: {
        'employee': 'emp/v2',
        'details': 'detailed',
        'timesheet': 'timesheet'
      },

      endpoints: {
        "empDetails": "_employee_/_details_/:empId/profile"
      }
  });
```

#### 4. Get your dynamic Endpoint URL from the Configured Endpoint list from `defaults()` method.

```javascript
var empDetails = ApiCluster
                  .get('empDetails')
                  .arg({
                    'empId': 1000 
                  })
                  .query({
                    'confirm': 'yes',
                    'testAccount': 'yes'
                  })
                  .url();
```
```
Expected Output: emp/details/1000/profile?confirm=yes&testAccount=yes
```
#### 5. Get Endpoint URL from the Configured Endpoint list from `v1` Group defined in `addAnother()` method.
```javascript
var empDetails = ApiCluster
                  .use('v1')
                  .get('empDetails')
                  .arg({
                    'empId': 1000 
                  })
                  .query({
                    'confirm': 'yes',
                    'testAccount': 'yes'
                  })
                  .url();
```
```
Expected Output: emp/v1/details/1000/profile?confirm=yes&testAccount=yes
```

## Example on how to use it in Node.

```javascript
var http = require('http'),
	ApiCluster = require('apicluster');

ApiCluster
  .defaults({
      name: 'mydefault',
 
      config: {
        'employee': 'emp',
        'details': 'details',
        'timesheet': 'timesheet'
      },
 
      endpoints: {
        "empDetails": "_employee_/_details_/:empId/profile"
      }
  });

//Lets define a port we want to listen to
const PORT = 9000; 

// Function which handles requests and send response
function handleRequest(request, response) {
	var empDetailURL = ApiCluster
                  .get('empDetails')
                  .arg({
                    'empId': 1000 
                  })
                  .query({
                    'confirm': 'yes',
                    'testAccount': 'yes'
                  })
                  .url();
    response.end('<h1>Generated Endpoint URL:<br> '
    	+ empDetailURL + '</h1>');
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    // Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
```

## Want to contribute?

Anyone can help make this project better - check out the [Contributing guide](/CONTRIBUTING.md)!

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/ramsunvtech/apicluster/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


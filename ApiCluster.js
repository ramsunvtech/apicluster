//     ApiCluster.js 0.0.1
//     (c) 2006-2016 R.Venkatraman, UI Architect.
//     ApiCluster may be freely distributed under the MIT license.

'use strict';

(function() {
  var ApiCluster = {};

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global;

  // Export the ApiCluster object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `ApiCluster` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports.ApiCluster = ApiCluster;
  } else {
    root.ApiCluster = ApiCluster;
  }

  // Current version.
  ApiCluster.VERSION = '0.0.1';

  // Generated Endpoint.
  ApiCluster.generated = '';

  // Define Data for Config, Groups, Modules, Definition, API URLs.
  ApiCluster.data = {};
  ApiCluster.data.endpointPrefix = '';
  ApiCluster.data.configPrefix = '_';
  ApiCluster.data.configSuffix = '_';
  ApiCluster.data.argPrefix = ':';
  ApiCluster.data.apiLabelSeparator = '-';
  ApiCluster.data.config = {};
  ApiCluster.data.defaultGroupName = '';
  ApiCluster.data.otherGroupList = [];
  ApiCluster.data.useGroupName = '';
  ApiCluster.data.definition = {};
  ApiCluster.data.apiUrls = {};

  // Define the Config.
  ApiCluster.Config = function (options) {
    // Push it to Config.
    ApiCluster.data.config = options;

    return this;
  };

  // Return the current config for given variable.
  ApiCluster.getConfig = function (variable) {
    if ( variable !== '' ) {
      return ApiCluster.data.config[variable];
    }
  };

  ApiCluster.__switchToValue = function (definition) {
    var config = ApiCluster.data.config;

    if( typeof config == 'object' ) {
      for(var configName in config) {
        var constantName = ApiCluster.data.configPrefix + configName + ApiCluster.data.configSuffix,
            regEx = new RegExp(constantName,"g");

        if( typeof definition == 'string' ) {
          definition = definition.replace(regEx, config[configName]);
        }

      }

      return definition;
    }
  };

  // Iterate Recursively to Define the Endpoints.
  ApiCluster._iterateDefinition = function (groupName, details, prefix) {
    var keyWithPrefix, ApiClusterPrefix, ApiClusterPrefixKey,
        apiLabelSeparator = ApiCluster.data.apiLabelSeparator;

    for(var key in details) {
      if(details[key] && details[key].constructor === Object) {
        ApiCluster.data.endpointPrefix += (!ApiCluster.data.endpointPrefix) ? key : apiLabelSeparator + key;
        ApiCluster._iterateDefinition( groupName, details[key], ApiCluster.data.endpointPrefix );
      }
      else {
        keyWithPrefix = key;
        ApiClusterPrefix = ApiCluster.getConfig(prefix);

        if(prefix) {
          keyWithPrefix = prefix + apiLabelSeparator + key;

          ApiClusterPrefixKey = keyWithPrefix.split(apiLabelSeparator).map(function (element) {
            return ApiCluster.getConfig(element) || '';
          });

          ApiClusterPrefix = ApiClusterPrefixKey.join('');
        }
        ApiCluster.data.apiUrls[groupName][keyWithPrefix] = ApiClusterPrefix + ApiCluster.__switchToValue( details[key] );
      }
    }
  };

  // Push the Group to API URLs.
  ApiCluster.__setGroup = function (name, details) {
    if( typeof name == 'string' && typeof details == 'object' ) {
      ApiCluster.data.endpointPrefix = '';
      ApiCluster.data.definition[name] = details;
      ApiCluster.data.apiUrls[name] = {};
      ApiCluster._iterateDefinition(name, details);
    }
  };

  // Add a Default Group.
  ApiCluster.defaults = function (options) {
    var name = options.name,
        config = options.config,
        details = options.endpoints;

    ApiCluster.Config(config);
    ApiCluster.data.defaultGroupName = name;
    ApiCluster.__setGroup(name, details);

    return this;
  };

  // Add Another Group.
  ApiCluster.addAnother = function (options) {
    var name = options.name,
        config = options.config,
        details = options.endpoints,
        anotherGroups = ApiCluster.data.otherGroupList;
    
    if( anotherGroups.constructor == Array && anotherGroups.indexOf(name) == -1) {
      ApiCluster.data.otherGroupList.push(name);
    }
    
    ApiCluster.Config(config);
    ApiCluster.__setGroup(name, details);

    return this;
  };

  // Use Group in run time.
  ApiCluster.use = function (name) {
    ApiCluster.data.useGroupName = name;
    return this;
  };

  // Set Default Group in run time.
  ApiCluster.setDefaultGroup = function (name) {
    ApiCluster.data.defaultGroupName = name;
    return this;
  };

  // Generate the Base Endpoint.
  ApiCluster.get = function (name) {
    var groupName = ApiCluster.data.useGroupName || ApiCluster.data.defaultGroupName;
 
    ApiCluster.generated = ApiCluster.data.apiUrls[groupName][name];
    return this;
  };

  // Generate the Arguments.
  ApiCluster.arg = function (options) {

    if( typeof options == 'object' ) {
      for( var argName in options ) {
        var prefixedArgName = ApiCluster.data.argPrefix + argName,
            regEx = new RegExp(prefixedArgName,"g");

        if(ApiCluster.generated) {
          ApiCluster.generated = ApiCluster.generated.replace(regEx, options[argName]);  
        }
      }
    }
    return this;
  };

  // Generate the Query Parameter.
  ApiCluster.query = function (options) {
    var queryString = '',
        i = 0;

    if( typeof options == 'object' ) {

      for( var queryName in options ) {
        i++;

        if(i == 1) {
          queryString = '?';
        }
        else {
          queryString += '&';
        }

        queryString += queryName + '=' + options[queryName];
      }

      ApiCluster.generated += queryString;
    }
    return this;
  };

  ApiCluster.url = function () {
    return ApiCluster.generated;
  };

}());

/*
* create and export configuration variables 
*
*/

// container for all environments
var environment = {}

// stagind (default ) enviroment

environment.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'stagingEvn'
}

// production environment

environment.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'productionEvn'
}

var currentEnvironment = typeof(process.env.node_env) == 'string' ? process.env.node_env.toLowerCase() : '';
var environmentToExport = typeof(environment[currentEnvironment]) == 'object' ? environment[currentEnvironment] : environment.staging;

// export module 
module.exports = environmentToExport;
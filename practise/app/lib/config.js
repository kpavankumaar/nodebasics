/*
*
*create and export configuration variables 
*
*/

// Container for all the environments
var environments = {};
// Staging(default) environments
environments.staging ={
	'httpPort': 3000,
	'httpsPort': 3001,
	'envName': 'staging',
	'hashingSecret': 'thisIsASecret'
}
// Production environment
environments.production ={
	'httpPort': 5000,
	'httpsPort': 5001,
	'envName': 'production',
	'hashingSecret': 'thisIsAlsoASecret'

}

// Determine which environment was passed as a command-line argument
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
// check that the current environment is one of the enviroments above , if not defaulting to staging
var environmentToExport = typeof(environments[currentEnviroment]) == 'object' ? environments[currentEnviroment]: environments.staging;


// export the module 

module.exports = environmentToExport;
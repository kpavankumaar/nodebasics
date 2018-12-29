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
	'hashingSecret': 'thisIsASecret',
	'maxChecks': 5,
	'twilio': {
		'accountSid': 'AC9ccd184234dd47567f081f01411c6d77',
		'authToken': '33a504a5b1c5a8f44b88d29f33c478c8',
		'fromPhone': '+919666698000'
	}
}
// Production environment
environments.production ={
	'httpPort': 5000,
	'httpsPort': 5001,
	'envName': 'production',
	'hashingSecret': 'thisIsAlsoASecret',
	'maxChecks': 5,
	'twilio': {
		'accountSid': '',
		'authToken': '',
		'fromPhone': ''
	}
}

// Determine which environment was passed as a command-line argument
var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
// check that the current environment is one of the enviroments above , if not defaulting to staging
var environmentToExport = typeof(environments[currentEnviroment]) == 'object' ? environments[currentEnviroment]: environments.staging;


// export the module 

module.exports = environmentToExport;
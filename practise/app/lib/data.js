/*
 * this file is going to be used for storing or editing data
 */

 // This file is going to have two dependencies 

// dependencies
var fs = require('fs');
var path = require('path');// normalize the path to different directories
var helpers = require('./helpers');
// container for the module (to be exported )
var lib ={};

// specifying path - __dirname is current directory we are in , and 2nd argument is for second folder we want to reach
lib.baseDir = path.join(__dirname,'/../.data/');
// writing data to a file 
lib.create = function (dir,file,data,callback){

	// open the file for writing  - .json file extension is to be added and wx is flag added to the file name .there are many flags we can use but for now this is usefull
	// file descriptor is a way to uniquely identify a specific file . we will use fileDescriptor to do next things 
	fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx',function(err,fileDescriptor){
		console.log('error ', err);
		console.log('fileDescriptor ', fileDescriptor);
		if(!err && fileDescriptor){
			// convert data to a string because this library will thrown with data in object format so convert them to string 
			var stringData = JSON.stringify(data);
			// write to file and close it 
			fs.writeFile(fileDescriptor,stringData, function(err){
				if(!err){
					fs.close(fileDescriptor,function(err){
						if(!err){
							callback(false); // false argument because there is no error, then error  is false, means no errors .
						}else{
							callback('error closing new file');
						}
					})
					callback(false);// false arguement because there is no error, then error is false, means no errors 
				}else{
					callback('error writing to new file');
				}
			});

		}else{
			callback('Could not create a new file , file may already exist');
		}
	});
}


// read data from a file 

lib.read = function(dir,file,callback){
	fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
		if(!err && data){
			var parsedData = helpers.parseJsonToObject(data);
			callback(false,parsedData);
		}else{
			callback(err, data);
		}
		
	})
}

// update data in existing file 

lib.update = function(dir,file,data,callback){
	// open the file for writing 
	fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
		if(!err && fileDescriptor){
			var stringData = JSON.stringify(data);
			// truncate the file 
			fs.truncate(fileDescriptor,function(err){
				if(!err){
					// write to the file and close it 
					fs.writeFile(fileDescriptor,stringData,function(err){
						if (!err) {
							fs.close(fileDescriptor,function(err){
								if(!err){
									callback(false);
								}else{
									callback('error closing the file ');
								}
							})
						}else{
							callback('error writing to existing file');
						}
					})
				}else{
					callback('error truncating file ');
				}
			})

		} else {
			callback('couldnot open the file for updating, file may not exist yet ');
		}
	});
	// difference between wx is for writing , throw error if file already exists  and r+ is usefull for writing ,throws error file doesnot exist 
}	

// delete a file 
lib.delete = function(dir,file,callback){
	// unlink the file (means unlinking the file from file system)
	fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
		if(!err){
			callback(false);
		}else{
			callback('error deleting file ');
		}
	})
}	

// export the module 
module.exports = lib;
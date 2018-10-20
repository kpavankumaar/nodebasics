/* 
* this file is going to be used for storing data and editing data 
*/

// this file is going to have two dependencies 

// dependencies 
var fs = require('fs');
var path = require('path'); // normalize the path for different directories 

// container for the module (to be exported )
var lib = {};

// specifying path - __dirname is current directory we are in , and second argument is for reaching out for second folder
lib.basedir = path.join(__dirname+'/../.data/');

// writing data to file 
lib.create = function(dir,file,data,callback){
    // open the file for writing .json extention to be added to the file , add wx to the file name , there are many flags we can use for now we can use wx
    // file descriptor is a way to uniquely identify a specific file , we will use file descriptor to do next things 
    // fs.open(lib.basedir+'/'+dir+'/'+file+'.json','wx', function(err, fileDescriptor ){    
    //     console.log('err',err);
    //     console.log('fileDescriptor', fileDescriptor);
    //     if(!err && fileDescriptor){
    //         // convert data object to a string 
    //         var stringData = JSON.stringify(data);
    //         fs.writeFile(fileDescriptor,stringData,function(err){
    //             if(!err){
    //                 fs.close(fileDescriptor,function(err){
    //                     if(!err){
    //                         callback(false);// false argument because there is no error, then error is false, means no errors 
    //                     }else{
    //                         callback(' error closing new file ');
    //                     }
    //                 })
    //                 callback(false); // false argument because there is no error , then error is false, means no errors .
    //             }else{
    //                 callback('error closing new file');
    //             }
    //         })
    //     }else{
    //         callback('couldnot create a new file, file may alread exist');
    //     }
    // });
    
};

// read data from a file 

lib.read = function(dir,file,callback){
    fs.readFile(lib.basedir+dir+'/'+file+'.json','utf8',function(err,data){
        callback(err, data);
    })
}

// update data in existing file 
lib.update = function(dir,file,data,callback){
    fs.open(lib.basedir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        var stringData = JSON.stringify(data);
        fs.truncate(fileDescriptor, stringData)
    })
}
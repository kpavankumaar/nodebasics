let fs = require('fs');
// example 1
// All file system operations have synchronous and asynchronous forms.
// The asynchronous form always takes a completion callback as its last argument.The arguments passed to the completion callback depend on the method, but the first argument is always reserved for an exception.If the operation was completed successfully, then the first argument will be null or undefined. 
// fs.unlink('../.data/newfile.json',(err)=>{
	// 	console.log(err);
// });

// fs.unlink('../.data/temp',(err)=>{
// 	if(err) throw err;
// 	console.log('successfully deleted temp.txt file' );
	// })
// try{
// 	fs.unlinkSync('../.data/temp.txt');
// 	console.log('successfully deleted temp.txt')
// }catch(err){
// 	// handle the error
// 	console.log(err);
// }
fs.rename('../.data/temp.txt','../.data/sample.txt',(err)=>{
	// if(err) throw err;
	console.log('renamed complete');
	fs.stat('../.data/sample.txt', (err, stats) => {
		if (err) throw err;
		console.log(`stats: ${JSON.stringify(stats)}`)
	});
});

function bad() {
	require('fs').readFile('/');
}
bad();


// fs.open('../.data/newfile.json','a',function(err, fd){
// 	// console.log('err', err);
// 	// console.log('filedescriptor',fd);
// 	// fs.writeFile(fd,'hello pavan and ravi',function(err){
// 	// 	console.log(err);
// 	// })
// 	// fs.readFile(fd,'utf8',function(err,data){
// 	// 	console.log('data',data);
// 	// 	fs.close(fd,function(err){
// 	// 		console.log('close err', err)
// 	// 	})
// 	// })
// 	// fs.close(fd,function(err){
// 	// 	console.log('close err', err)

// 	// })
// 	console.log('fd outside the append file ', fd);
// 	fs.appendFile(fd,' data to append','utf8',function(err){
// 		// console.log(err);
// 		console.log('fd inside the file ', fd);
// 		fs.readFile('../.data/newfile.json', 'utf8', function (err,data) {
// 			console.log('fd inside readfile ', fd);
// 			// console.log('data ', data);
// 			// console.log('err', err);
// 		})
	// 	})
// 	// fs.readFile('../.data/newfile.json','utf8',function(data){
// 	// 	console.log('data ',data);
// 	//  	console.log('err ',err);
// 	// })

	// })
// // fs.open(filepath,fileflag,function(err,fd){
// // 	fs.open('')
// // });




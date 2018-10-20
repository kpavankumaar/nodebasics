let fs = require('fs');
fs.open('../.data/newfile.json','a',function(err, fd){
	console.log('err', err);
	console.log('filedescriptor',fd);
	// fs.writeFile(fd,'hello pavan and ravi',function(err){
	// 	console.log(err);
	// })
	// fs.readFile(fd,'utf8',function(err,data){
	// 	console.log('data',data);
	// 	fs.close(fd,function(err){
	// 		console.log('close err', err)
	// 	})
	// })
	// fs.close(fd,function(err){
	// 	console.log('close err', err)

	// })
	fs.appendFile(fd,' data to append','utf8',function(err){
		console.log(err);
	})

})
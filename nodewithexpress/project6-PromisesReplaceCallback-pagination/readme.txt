lets focus on posting data 
product controller is the place where entire logic is residing

saved and returned data from server to client
{"_id":"5c9b5a95b672df783756a162","brand":"Motorolla","model":"motoz","price":500,"inStock":true,"__v":0}

__v is model tracking by mongoose
mongoose keeps track of model changes 


// pagination

pageSize - 10 
pageIndex 0 - 9 
100 records ==> 100/10 ==> totalrecords/ pageSize  10

1st page            pageIndex + pageSize --> 0 + 10 = 10 |  pageIndex * pageSize 
0 --- 9  

2nd page            pageIndex + pageSize --> 1 + 10 = 11 
10 --- 19

3rd page            pageIndex + pageSize --> 2 + 10 = 12 
20 --- 29


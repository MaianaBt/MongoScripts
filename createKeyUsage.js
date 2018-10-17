var db = connect("localhost:27017/flightserver");
//var db = connect("mongodb://incodde:incodde123@ds153700.mlab.com:53700/flightserver-test");


var begin = ISODate("2018-10-16T03.00.000Z");
var end = ISODate("2018-10-17T03.00.000Z");
var cursor = db.getCollection('requests').find({
    date: {$gte:begin, $lte:end}
});
var keys = {};

while(cursor.hasNext()){
    var obj = cursor.next();
    if(!keys[obj.params.api_key]) {
        keys[obj.params.api_key] = 0;
    }
    keys[obj.params.api_key]++;
}

var response = [];
for(var key in keys){
    response.push({
        'api_key': key,
        'requests': keys[key]
    })
}

var keyUsage = db.getCollection('key_usage');
var dateUsage = {
    date: begin,
    keys: response
}
keyUsage.insertOne(dateUsage);
printjson(dateUsage);
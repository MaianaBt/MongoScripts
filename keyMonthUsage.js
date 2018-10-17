var db = connect("localhost:27017/flightserver");
//var db = connect("mongodb://incodde:incodde123@ds153700.mlab.com:53700/flightserver-test");


var begin = ISODate("2018-10-01T03.00.000Z");
var end = ISODate("2018-11-01T03.00.000Z");
var keyUsage = db.getCollection('key_usage');
var cursor = db.getCollection('requests').find({
    date: {$gte:begin, $lte:end}
});
var dates = {};

while(cursor.hasNext()){
    var obj = cursor.next();
    var originalDate = new Date(obj.date);
    var date = new Date(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate()).toISOString();
    if(!dates[date]) {
        dates[date] = [];
    }
    dates[date].push(obj.params.api_key);
}

for(var date in dates){
    var keys = dates[date].reduce(function(ant, curr){
        if(!ant[curr]) {
            ant[curr] = 0;
        }
        ant[curr]++
        return ant
    }, {})
    var response = [];
    for(var key in keys){
        response.push({
            'api_key': key,
            'requests': keys[key]
        })
    }
    var dateUsage = {
        date: ISODate(date),
        keys: response
    }
    keyUsage.insertOne(dateUsage);
}
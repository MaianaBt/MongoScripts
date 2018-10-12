var db = connect("localhost:27017/flightserver");
var request = db.getCollection('requests');
var cursor = request.find({response:{$nin: [null, false, true]}});
var responses = db.getCollection('responses');

while(cursor.hasNext()){
	var request = cursor.next();
	var updatedRequest = {_id: request._id.valueOf()}
	var newResponse = {
		results : request.response.results,
		Busca: request.response.Busca,
		Trechos: request.response.Trechos,
		id_request: request._id
	}
	//responses.insertOne(newResponse);
	//falta fazer a atualizacao 
}

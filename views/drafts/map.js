function(doc){
	if(!doc.status){
		emit(doc.date, doc);
	}
}
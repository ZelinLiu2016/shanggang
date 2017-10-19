var lhy = []
function test(){
	for (var i = 0; i<data.length; i++) {
		var ob = PK54ToWGS(123 , data[i][1], data[i][0]);
		lhy.push(ob);
		
	}
	console.log(lhy);
}
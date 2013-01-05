var request = require('request');
var express = require('express');
var app = express();


app.get('/data/:salary/:id?', function(req, res){
	var department_id = req.params.id != null ? req.params.id : "00"
	request({url: 'http://budget.yeda.us/' + department_id + '?year=2012&depth=1', encoding: 'utf-8'}, function (error, response, body) {
 		if (!error && response.statusCode == 200) {
			res.setHeader('Content-Type', 'text/html; charset=utf-8');
			res.setHeader('Content-Length', body.length);
			var data = JSON.parse(body);
			var total = data[0].net_amount_allocated
			var content = "<table dir='rtl'>"
			for (var i = 1; i < data.length; i++) {
				var title = data[i].title
				var amount = data[i].net_amount_allocated
				var ratio = amount / total
				var salary_to_departmet = 1*ratio*req.params.salary;
				var budget_id = data[i].budget_id
				if (salary_to_departmet > 0) {
					content += "<tr><td><a href='/data/" + salary_to_departmet + "/" + budget_id + "'>" + title + "</a></td><td>" + salary_to_departmet + "</td></tr>"	
				}
			}
			content += "</table>"
  			res.end(content);
  		}
	})
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something is boken');
});

app.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
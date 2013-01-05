var request = require('request');
var express = require('express');
var app = module.exports = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('layout', 'layout');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'sdf987fijhaf98y3fkjwa' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something is boken');
});


app.get('/', function(req, res){
	var department_id = req.query.id || "00"
  var salary = req.query.salary || ""

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (salary > 0) {
  	request({url: 'http://budget.yeda.us/' + department_id + '?year=2012&depth=1', encoding: 'utf-8'}, function (error, response, body) {
   		if (!error && response.statusCode == 200) {
  			var data = JSON.parse(body);
        var department = data[0].title
  			var total = data[0].net_amount_allocated
        var content = ""
  			for (var i = 1; i < data.length; i++) {
  				var title = data[i].title
  				var amount = data[i].net_amount_allocated
  				var ratio = amount / total
  				var salary_to_departmet = ratio*salary;
  				var budget_id = data[i].budget_id
  				if (salary_to_departmet > 0) {
  					content += "<tr><td><a href='/?salary=" + salary_to_departmet + "&id=" + budget_id + "'>" + title + "</a></td><td>" + salary_to_departmet + "</td></tr>"	
  				}
  			}
        res.render('index', {
          title: 'איפה הכסף - ' + department,
          result: content,
          salary: salary
        });        
    	}
  	})
  }
  else {
    res.render('index', {
      title: 'איפה הכסף',
      result: "",
      salary: ""
    });    
  }


});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);

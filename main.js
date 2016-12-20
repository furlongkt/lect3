const express = require("express");
const bodyParser = require("body-parser");
var expressValidator = require('express-validator');
const app = express();
const static = express.static(__dirname + '/public');

const configRoutes = require("./routes");

const exphbs = require('express-handlebars');

const Handlebars = require('handlebars');

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        },

        partial: function (name) {
            return name;
        },

        monthToString: function (monthAsInt) {
            var arr = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            return arr[monthAsInt%12];
        },

        isEqual: function(x,y){
            return (x==y);
        },

        getDayOfWeek: function(month,day,year){
            console.log("GettingDay: "+ month+"/"+day+"/"+year);
            var date = new Date(year,month,day).getDay();
            var options = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return options[date%7];
        },

        dayOfTheYear: function(month,day,year){
            var now = new Date(year,month,day);
            var start = new Date(year, 0, 0);
            var diff = now - start;
            var oneDay = 1000 * 60 * 60 * 24;
            var day = Math.floor(diff / oneDay);
            return day;
        },

        daysLeftInYear: function(month,day,year){
            var now = new Date(year,month,day);
            var start = new Date(year, 11, 30);
            var diff = start-now;
            var oneDay = 1000 * 60 * 60 * 24;
            var day = Math.floor(diff / oneDay);
            return day;
        }
        

        //TODO create function that gets day of the year (given a date returns its day of the year)
    },
    partialsDir: [
        'views/partials/'
    ]
});

const electronApp = require("./electron-app");

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);
// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {  
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
    console.log("Now launching electron app");
    electronApp();
});
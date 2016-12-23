const express = require("express");
const bodyParser = require("body-parser");
var expressValidator = require('express-validator');
var db = require('diskdb');
db = db.connect('./db', ['events']);
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
            var start = new Date(year, 11, 31);
            var diff = start-now;
            var oneDay = 1000 * 60 * 60 * 24;
            var day = Math.floor(diff / oneDay);
            return day;
        },

        dayAfter: function(month,day,year,count){
            var oldDate = new Date(year,month,day);
            var newDate = new Date(year,month,day);
            newDate.setDate(oldDate.getDate() + count);
            updated = {
                month: (newDate.getMonth()+1),
                day: newDate.getDate(),
                year: (newDate.getYear() + 1900)
            }
            return updated;
        },

        dayBefore: function(month,day,year,count){
            var oldDate = new Date(year,month,day);
            var newDate = new Date(year,month,day);
            newDate.setDate(oldDate.getDate() - count);
            updated = {
                month: (newDate.getMonth() + 1),
                day: newDate.getDate(),
                year: (newDate.getYear() + 1900)
            }
            return updated;
        },

        getEvents: function(month,day,year){
            allEvents = db.events.find();
            if(day!=null && day !="null"){
                eventsOnDay = allEvents.filter((event) =>{
                    return ((event.month == month) && (event.day == day) && (event.year == year));
                }).concat();
                if(eventsOnDay.length >0){
                    return eventsOnDay;
                }else{
                    return [];
                }
            }else{
                return [];
            }
        },

        getLinkToNextMonth: function(month,year){
            var now = new Date(year,month,1);
            current = new Date(now.getFullYear(), now.getMonth()+1, 1);
            return "/view/"+current.getMonth()+"/"+current.getFullYear();
        },

        getLinkToPrevMonth: function(month,year){
            var now = new Date(year,month,1);
            current = new Date(now.getFullYear(), now.getMonth()-1, 1);
            return "/view/"+current.getMonth()+"/"+current.getFullYear();
        },

        repeat: function(n, block){
            var accum = '';
            for(var i = 0; i < n; ++i)
                accum += block.fn(i);
            return accum;
        },

        add: function(val1, val2){
            return parseInt(val1) + parseInt(val2);
        },

        numDays: function(month,year){
            var now = new Date(year, month+1, 0);
            console.log("This month: "+ now);
            return now.getDate();
        }
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
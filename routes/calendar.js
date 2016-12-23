const express = require('express');
var db = require('diskdb');
db = db.connect('./db', ['events']);
var uuid = require('node-uuid');
const router = express.Router();
const data = require("../data");
const bookData = data.books;
const VIEW = {
  MONTH : {value: 0, name: "monthly"}, 
  WEEK: {value: 1, name: "weekly"}, 
  DAY : {value: 2, name: "daily"}
};
var currentView = VIEW.MONTH;

function getDaysOfMonth(month,year){
        var now = new Date(parseInt(year), (parseInt(month) + 1), 0);
        var numDays = now.getDate();
        console.log(month+"/"+ year+": "+ now);
        var firstDay = new Date(year,month,1);
        var lastDay = new Date(year,month,numDays);
        var ret = new Array();
        var paddedCount = firstDay.getDay();

        while(paddedCount>0){
            ret.push(null);
            paddedCount--;
        }
        
        for (i = 1; i <= numDays; i++) { 
            ret.push(i);
        }

        var paddedCount = lastDay.getDay();
        while(paddedCount<6){
            ret.push(null);
            paddedCount++;
        }
        return ret;
    }
 
router.get("/event", (req, res) => {
    objects = db.events.find();
    return res.json({success:true, objects: objects});
});

router.get("/test",(req,res)=>{
    res.render("test");
});

router.get("/addEventForm", (req, res) => {
    res.render('eventForm');
});

router.post("/event", (req, res) => {
    console.log("POST: "+req.body.year+"-"+req.body.month+"-"+req.body.day);
    req.checkBody('year', 'Year is required and must be an integer').notEmpty().isInt();
    req.checkBody('month', 'Month is required and must be an integer').notEmpty().isInt();
    req.checkBody('day', 'Day is required and must be an integer').notEmpty().isInt();
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('location', 'Location is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
      return res.json({ success: false, errors: errors });
        //return res.render('addEventForm', errors);
    }else{
        var newEvent = {
            _id: uuid.v4(),
            year: req.body.year,
            month: req.body.month,
            day: req.body.day,
            title: req.body.title,
            location: req.body.location,
            description: req.body.description
        }
        db.events.save(newEvent);
        return res.json({ success: true, msg: "Success! You have successfully added a new event titled: "+newEvent.title });
    }
});

router.put("/event", (req, res) => {
    req.checkBody('id', 'ID is required').notEmpty();
    req.checkBody('year', 'Year is required and must be an integer').notEmpty().isInt();
    req.checkBody('month', 'Month is required and must be an integer').notEmpty().isInt();
    req.checkBody('day', 'Day is required and must be an integer').notEmpty().isInt();
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('location', 'Location is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
      return res.json({ success: false, errors: errors });
        //return res.render('addEventForm', errors);
    }else{
        var event = {
            year: req.body.year,
            month: req.body.month,
            day: req.body.day,
            title: req.body.title,
            location: req.body.location,
            description: req.body.description
        }
        var updated = db.events.update({_id: req.body.id}, event,{multi: false, upsert:false});
        if(updated.updated > 0){
          res.json({ success: true, msg: "Success! You have successfully updated the event titled: "+event.title });
        }else{
          res.json({ success: false, error: "Error: Cannot find event with ID: "+ req.body.id });
        }
    }
});

router.get("/event/:id", (req, res) => {
    event = db.events.find({_id: req.params.id});
    if(event.length > 0){
        event = db.events.find({_id: req.params.id});
        return res.render('eventDetails', {event: event});
    }else{
        return res.redirect('/');
    }
});

router.delete("/event/:id", (req, res) => {
    if(db.events.remove({_id : req.params.id}, false)){
      return res.json({ success: true, msg: "Success! You have successfully deleted the event with an id: "+req.params.id });
    }
    return res.json({ success: false, err: err, error: "Error: Cannot find event with ID: "+ req.params.id });
  });

router.get("/view/:month/:year", (req, res) => {
    var daysOfMonth = getDaysOfMonth(req.params.month, req.params.year);
    res.render("monthly", {month: req.params.month, year: req.params.year, days: daysOfMonth});
});

router.get("/view/:month/:year/:day", (req, res) => {
    res.render("daily", {month: req.params.month, year: req.params.year, day: req.params.day});
});

module.exports = router;
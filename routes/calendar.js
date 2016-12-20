const express = require('express');
var store = require('json-fs-store')();
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
 
router.get("/event", (req, res) => {
    //res.render("addEventForm");
    store.list(function(err, objects) {
      // err if there was trouble reading the file system
      if (err) throw err;
      // objects is an array of JS objects sorted by name, one per JSON file
      res.json({success:true, objects: objects});
    });
});

router.post("/event", (req, res) => {

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
            id: uuid.v4(),
            year: req.body.year,
            month: req.body.month,
            day: req.body.day,
            title: req.body.title,
            location: req.body.location,
            description: req.body.description
        }
        store.add(newEvent, function(err) { 
          if (err)
            return res.json({ success: false, error: "Error: Cannot find event with ID: "+ req.body.id });
            //return res.render({errorMsg: "Error: Cannot find event with ID: "+ req.body.id });
          return res.json({ success: true, msg: "Success! You have successfully added a new event titled: "+newEvent.title });
          //return res.render({successMsg: "Success! You have successfully added a new event titled: "+newEvent.title} );;
        });
    }
});

router.put("/event", (req, res) => {
    req.checkBody('id', 'ID is required').notEmpty().len()
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
            id: req.body.id,
            year: req.body.year,
            month: req.body.month,
            day: req.body.day,
            title: req.body.title,
            location: req.body.location,
            description: req.body.description
        }
        store.remove(req.body.id, function(err) { 
          if (err){
              return res.json({ success: false, error: "Error: Cannot find event with ID: "+ req.body.id });
              //return res.render({errorMsg: "Error: Cannot find event with ID: "+ req.body.id });
          }
          store.add(newEvent, function(err) { 
            if (err)
              return res.json({ success: false, error: "Error: Cannot find event with ID: "+ req.body.id });
              //return res.render({errorMsg: "Error: Cannot find event with ID: "+ req.body.id });
            return res.json({ success: true, msg: "Success! You have successfully updated the event titled: "+newEvent.title });
            //return res.render({successMsg: "Success! You have successfully added a new event titled: "+newEvent.title} );;
          });
        });
    }
});

router.delete("/event/:id", (req, res) => {
    store.remove(req.params.id, function(err) { 
        if (err){
            return res.json({ success: false, err: err, error: "Error: Cannot find event with ID: "+ req.params.id });
            //return res.render({errorMsg: "Error: Cannot find event with ID: "+ req.body.id });
        }
        return res.json({ success: true, msg: "Success! You have successfully deleted the event with an id: "+req.params.id });
    });
  });

router.get("/view/:month/:year", (req, res) => {
    var daysOfMonth = bookData.getDaysOfMonth(req.params.month,req.params.year);
    console.log("Monthly View: " + req.params.month);
    res.render("monthly", {month: req.params.month, year: req.params.year, days: daysOfMonth});
});

router.get("/view/:month/:year/:day", (req, res) => {
    var daysOfMonth = bookData.getDaysOfMonth(req.params.month,req.params.year);
    console.log("Daily View: " + req.params.month);
    res.render("daily", {month: req.params.month, year: req.params.year, day: req.params.day});
});

router.get("/:id", (req, res) => {
    bookData.getBook(req.params.id).then((book) => {
        res.render("books/single", {bookContent: book});
    }).catch(() => {
        res.status(404).json({ error: "User not found" });
    });
});

module.exports = router;
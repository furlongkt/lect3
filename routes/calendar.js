const express = require('express');
const router = express.Router();
const data = require("../data");
const bookData = data.books;
const VIEW = {
  MONTH : {value: 0, name: "monthly"}, 
  WEEK: {value: 1, name: "weekly"}, 
  DAY : {value: 2, name: "daily"}
};
var currentView = VIEW.MONTH;

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

// router.get("/", (req, res) => {
//     bookData.getLocalBooks().then((bookList) => {
//         res.render("books/local", bookList);
//     }, () => {
//         // Something went wrong with the server!
//         res.sendStatus(500);
//     });
// });

module.exports = router;
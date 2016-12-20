const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));
const path = require("path");

let exportedMethods = {
    getLocalBooks() {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    },
    // This is a fun new syntax that was brought forth in ES6, where we can define
    // methods on an object with this shorthand!
    getBook(id) {        
        const bookPath = path.resolve(__dirname, "book-files/", `${id}.html`);

        return fs.statAsync(bookPath).then((stats) => {
            return fs.readFileAsync(bookPath, "utf-8");
        });
    },


    getDaysOfMonth(month,year){
        var numDays = new Date(year, month+1, 0).getDate();
        var firstDay = new Date(year,month,1);
        var lastDay = new Date(year,month,numDays);
        console.log(month +"/"+year +" - "+ firstDay);
        var ret = new Array();
        var paddedCount = firstDay.getDay();
        console.log("paddedCount: "+ paddedCount);
        while(paddedCount>0){
            ret.push(null);
            paddedCount--;
        }
        
        for (i = 1; i <= numDays; i++) { 
            ret.push(i);
        }
        console.log(ret);
        var paddedCount = lastDay.getDay();
        while(paddedCount<6){
            ret.push(null);
            paddedCount++;
        }

        // var res = [];
        // while (ret.length) {
        //     res.push(ret.splice(0, 7));
        // }

        // return res;
        return ret;
    }

}

module.exports = exportedMethods;
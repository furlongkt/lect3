const calRoutes = require("./calendar");

const constructorMethod = (app) => {
    app.use("/", calRoutes);

    app.use("*", (req, res) => {
    	var today = new Date();
        res.redirect("/view/"+today.getMonth()+"/"+(1900 + today.getYear()));
    })
};

module.exports = constructorMethod;
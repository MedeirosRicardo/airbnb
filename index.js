// Name: Ricardo Medeiros
// Seneca Student ID: 135745180
// Seneca email: rmedeiros7@myseneca.ca
// Date: 2019-10-03
// WEB322 - Assignment - Node.js and Express

// SETUP START ***********************
// Importing libraries
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");
const session = require("express-session");

// Load dotenv variables
require("dotenv").config({path:"./config/config.env"});

// Import routes
const userRoutes = require("./routes/user");
const roomRoutes = require("./routes/room");
const generalRoutes = require("./routes/general");

// Create express object
const app = express();

// Setup express
app.use(bodyParser.urlencoded({extended: false}));
app.use(fileUpload());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Map express to routes objects
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/room",roomRoutes);

app.use("/",(req,res) => {
    res.render("general/404");
});

// Session setup
app.use(session({secret: "This is my secret key."}));
app.use((req,res,next) => {
    res.locals.user=req.session.userInfo;
    next();
});
// ************************* SETUP END


// DATABASE CONNECTION START ************
const mongoDBUrl = `mongodb+srv://${process.env.dbUser}:${process.env.dbPass}@cluster0-apgkj.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`;
mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log(`Connected to database`);
})
.catch((err) => {
    console.log(`Error connecting to database: ${err}`);
});
// ************** DATABASE CONNECTION END


// WEB SERVER SETUP START ************
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web server is listening on port ${PORT}`);
});
// ************** WEB SERVER SETUP END
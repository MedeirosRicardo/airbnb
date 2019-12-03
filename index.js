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

const config = require('./config/config');

// Initializing express
const app = express();

// Midleware
app.use(express.static("public"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({extended: false}));
// ************************* SETUP END

// DATABASE CONNECTION START ************
mongoose.connect(config.getDB(), {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log(`Database is connected`);
})
.catch((err) => {
    console.log(`Error connecting to database: ${err}`);
});
// ************** DATABASE CONNECTION END


// REGULAR EXPRESSION
// Email
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegexp = /^[A-Za-z0-9]{6,12}$/;
// ******************


// ROUTES START ***********************
// Home
app.get("/", (req, res) => {
    res.render("index");
});

// Dashboard
app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

// Room Listining
app.get("/rooms", (req, res) => {
    res.render("rooms");
});

// User login
app.get('/login', (req, res) => {
    res.render('login');
});

// User login form process
app.post('/login', (req, res) => {
    
    const errors = [];

    if(req.body.email.trim() == '') {
        errors.push('Please enter a email');
    }

    if(req.body.psw.trim() == '') {
        errors.push('Please enter a password');
    }

    // There are errors during validation
    if(errors.length > 0) {
        res.render('login', {
            messages:errors
        });
    }

    // Validation is OK
    else {
        res.redirect('dashboard');
    }

});

// User Registration
app.get("/registration", (req, res) => {
    res.render("registration");
});

// User Registration form process
app.post('/registration', (req,res) => {

    // Create mongoose schema
    const Schema = mongoose.Schema;
    const userSchema = new Schema({
  
    email: {
        type: String,
        required: true
    },

    fName: {
        type: String,
        required: true
    },

    lName: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

// Try/catch to avoid model error
let User;
try {
    User = mongoose.model('User');
} catch {
    User = mongoose.model('User', userSchema);
}

    const newUser = {
        email: req.body.email,
        fName: req.body.fName,
        lName: req.body.lName,
        password: req.body.psw
    }

    const errors = [];

    if(emailRegexp.test(newUser.email) == false) {
        errors.push('Please enter a valid email');
    }

    if(newUser.fName.trim() == '') {
        errors.push('Please enter a valid first name');
    }

    if(newUser.lName.trim() == '') {
        errors.push('Please enter a valid last name')
    }

    if(passwordRegexp.test(newUser.password) == false) {
        errors.push('Please enter a valid password');
    }

    // There are erros during validation
    if(errors.length > 0) {
        res.render('registration', {
            messages:errors
        });
    }

    // Validation is OK
    else {
        const t = new User(newUser);
        t.save()
        .then(() => {
            console.log(`User was added to the database`);
            
            // Sendgrid - Confirmation email
            const nodemailer = require('nodemailer');
            const sgTransport = require('nodemailer-sendgrid-transport');

            let options = {
                auth: {
                    api_key: config.sendgridKey
                }
            }

            let mailer = nodemailer.createTransport(sgTransport(options));

            let email = {
                to: `${req.body.email}`,
                from: 'medeiros.ricardo@outlook.com',
                subject: 'Account Created',
                text: `${req.body.fName} ${req.body.lName}, your account was successfully created.`
            };

            mailer.sendMail(email, (err, res) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            });

            res.redirect('dashboard');
        })
        .catch(err=>console.log(`Error: ${err}`));
    }
});
// ************************* ROUTES END


// WEB SERVER SETUP START ************
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web server is listening on port ${PORT}`);
});
// ************** WEB SERVER SETUP END
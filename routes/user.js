// Load modules
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// REGULAR EXPRESSION
// Email
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegexp = /^[A-Za-z0-9]{6,12}$/;

// Allows CRUD operations
const User = require("../models/user");

// Route to user registration
router.get("/registration", (req,res) => {
    res.render("users/registration");
});

// User registration form process
router.post("/registration", (req,res) => {

    // User validation
    const newUser = {
        email: req.body.email,
        fName: req.body.fName,
        lName: req.body.lName,
        password: req.body.psw
    }

    const errors = [];

    if (emailRegexp.test(newUser.email) == false) {
        errors.push("Please enter a valid email");
    }

    if (newUser.fName.trim() == '') {
        errors.push("Please enter a valid first name");
    }

    if (newUser.lName.trim() == '') {
        errors.push("Please enter a valid last name");
    }

    if (newUser.password != req.body.psw2) {
        errors.push("Please make sure your passwords match");
    }

    if (passwordRegexp.test(newUser.password) == false) {
        errors.push("Please enter a valid password");
    }

    // There are erros during validation
    if (errors.length > 0) {
        res.render("users/registration", {
            messages: errors
        });
    }

    // Validation is OK
    else {
        const t = new User(newUser);
        t.save()
            .then(() => {
                console.log(`User was added to the database`);

                // Sendgrid - Confirmation email
                const nodemailer = require("nodemailer");
                const sgTransport = require("nodemailer-sendgrid-transport");

                let options = {
                    auth: {
                        api_key: process.env.sendgridKey
                    }
                }

                let mailer = nodemailer.createTransport(sgTransport(options));

                let email = {
                    to: `${req.body.email}`,
                    from: "medeiros.ricardo@outlook.com",
                    subject: "Account Created",
                    text: `${req.body.fName} ${req.body.lName}, your account was successfully created.`
                };

                mailer.sendMail(email, (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(res);
                    }
                });

                res.redirect("/users/dashboard");
            })
            .catch(err => console.log(`Error: ${err}`));
    }
});

// Rote to user login
router.get("/login", (req, res) => {
    res.render("users/login");
});

// User login form process
router.post("/login", (req, res) => {
    
    const errors = [];

    if(req.body.email.trim() == '') {
        errors.push("Please enter a email");
    }

    if(req.body.psw.trim() == '') {
        errors.push("Please enter a password");
    }

    // There are errors during validation
    if(errors.length > 0) {
        res.render("users/login", {
            messages:errors
        });
    }

    // Validation is OK
    else {
        res.redirect("/users/dashboard");
    }
});

// Route to dashboard
router.get("/dashboard", (req, res) => {
    res.render("users/dashboard");
});

module.exports = router;
// Load modules
const express = require("express");
const router = express.Router();
const Room = require("../models/room");
const path = require("path");

// Route to room list
router.get("/room", (req, res) => {
    
    Room.find()
    .then((rooms) => {
        res.render("rooms/rooms", {
            list: rooms
        });
    })
    .catch(err=>console.log(`Error: ${err}`));
});

// Router to add room
router.get("/add", (req,res) => {
    res.render("rooms/add");
});

// Process add room
router.post("/add", (req,res) => {
    
    const newRoom = {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
    }

    const errors = [];

    // File upload validation
    if (req.files == null) {
        errors.push("Sorry, you must upload an image");
    }

    // File type validation
    else {
        if (req.files.photo.mimetype.indexOf("image") == -1) {
            errors.push("Sorry, you can only upload image file");
        }
    }

    // If errors
    if (errors.length > 0) {
        res.render("rooms/add", {
            messages: errors,
            title: newRoom.title,
            price: newRoom.price,
            description: newRoom.description,
            location: newRoom.location,
        });
    }

    // No errors
    else {
        const room = new Room(newRoom);
        room.save()
        .then(room => {

            // Rename the file to include room id
            req.files.photo.name = `db_${room._id}${path.parse(req.files.photo.name).ext}`;

            // Upload file to server
            req.files.photo.mv(`public/uploads/${req.files.photo.name}`)

            // Link uploaded image with room
            .then(() => {
                Room.findByIdAndUpdate(room._id, {
                    photo: req.files.photo.name
                })
                .then(() => {
                    res.redirect("/user/admin");
                })
                .catch(err=>console.log(`Error: ${err}`));
            })
            .catch(err=>console.log(`Error: ${err}`));
        })
        .catch((err) => {
            if (err) {
                const errors = [];
                errors.push("All fields are mandatory");
                res.render("rooms/add", {
                    messages: erros,
                    title: newRoom.title,
                    price: newRoom.price,
                    description: newRoom.description,
                    location: newRoom.location,
                });
            }
        });
    }

});

module.exports = router;
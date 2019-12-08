// Load modules
const express = require("express");
const router = express.Router();

// Route to room list
router.get("/room", (req, res) => {
    res.render("rooms/rooms");
});

module.exports = router;
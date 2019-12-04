// Load modules
const express = require("express");
const router = express.Router();

// Route to room list
router.get("/rooms", (req, res) => {
    res.render("rooms/rooms");
});

module.exports = router;
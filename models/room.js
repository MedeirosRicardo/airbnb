const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create room schema
const roomSchema = new Schema({
    title: {
        type: String,
        require: true
    },

    price: {
        type: Number,
        require: true
    },

    description: {
        type: String,
        require: true
    },

    location: {
        type: String,
        require: true
    },

    photo: {
        type: String,
    },

    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

const roomModel = mongoose.model("Room",roomSchema);

module.exports = roomModel;
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    artysta: String,
    producent: String,
    dj: String,
    album: String,
    teledysk: String,
    wydarzenie: String
})
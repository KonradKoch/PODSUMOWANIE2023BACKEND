const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    artysta: String,
    producent: String,
    dj: String,
    album: String,
    teledysk: String,
    wydarzenie: String,
    impreza: String,
    email: String,
    confirmed: { type: Boolean, default: false },
}, {timestamps: true});

module.exports = mongoose.model('Votes', voteSchema)
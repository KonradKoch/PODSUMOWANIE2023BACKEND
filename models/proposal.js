const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    email: String,
    artysta: String,
    producent: String,
    dj: String,
    album: String,
    teledysk: String,
    wydarzenie: String,
}, {timestamps: true})

module.exports = mongoose.model('Proposals', proposalSchema)
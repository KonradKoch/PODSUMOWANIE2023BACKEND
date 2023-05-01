const mongoose = require('mongoose');
const year = new Date().getFullYear() - 1;

const voteCardSchema = new mongoose.Schema({
    category: String,
    name: String,
    votes: {
        type: Number,
        default: 0
    },
    image: String,
    year: String,
    video: String,
});

module.exports = mongoose.model('voteCards', voteCardSchema)
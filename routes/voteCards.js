const express = require('express');
const { saveVoteCard, showVoteCards } = require('../controllers/voteCards');

const router = express.Router();


router.post('/add-votecard', saveVoteCard);
router.get('/show-votecards', showVoteCards);

module.exports = router;

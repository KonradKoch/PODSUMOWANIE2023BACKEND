const express = require('express');
const { saveVoteCard, showVoteCards, showLastYearResults, showOldResults } = require('../controllers/voteCards');

const router = express.Router();


router.post('/add-votecard', saveVoteCard);
router.get('/show-votecards', showVoteCards);
router.get('/show-lastyear-results', showLastYearResults);
router.get('/show-old-results', showOldResults)

module.exports = router;

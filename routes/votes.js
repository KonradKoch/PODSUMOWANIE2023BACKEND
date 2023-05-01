const express = require('express');
const { saveVote, voteVerification } = require('../controllers/vote');

const router = express.Router();


router.post('/add-vote', saveVote);
router.put('/verify-vote', voteVerification);

module.exports = router;
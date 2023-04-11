const express = require('express');
const { emailCheck } = require('../middlewares/proposalAuth');
const { saveProposal } = require('../controllers/proposals');
const router = express.Router();


router.post('/add-proposal', emailCheck, saveProposal);

module.exports = router;

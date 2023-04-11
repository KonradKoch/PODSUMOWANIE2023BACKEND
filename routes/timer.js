const express = require('express');
const { getOrCreateTimerEvent } = require('../controllers/timer');
const router = express.Router();


router.get('/get-timer', getOrCreateTimerEvent);

module.exports = router;

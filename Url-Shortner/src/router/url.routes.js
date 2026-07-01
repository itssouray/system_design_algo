const express = require('express');
const router = express.Router();
const { shorten, redirect } = require('../controller/url.controller');

router.post('/shorten', shorten);
router.get('/:shortCode', redirect);

module.exports = router;
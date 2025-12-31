// Contact Routes
const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contact.controller');

// Public route - anyone can submit contact form
router.post('/', submitContact);

module.exports = router;


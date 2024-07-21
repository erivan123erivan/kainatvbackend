const express = require('express');
const router = express.Router();
const { addToLibrary, fetchPostbyUserId, deleteFromLibrary } = require('../controllers/myLibraryController');
// Define the route for adding to library
router.post('/add', addToLibrary);
router.get('/:userId', fetchPostbyUserId);
router.delete('/delete/:userId/:postId', deleteFromLibrary);
module.exports = router;

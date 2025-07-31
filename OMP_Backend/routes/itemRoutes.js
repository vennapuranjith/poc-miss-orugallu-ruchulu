const express = require('express');
const router = express.Router();
const { getAllItems, getItemById } = require('../controllers/itemController');

// GET /api/items  - get all items
router.get('/', getAllItems);

// GET /api/items/:id - get one item by id
router.get('/:id', getItemById);

module.exports = router;
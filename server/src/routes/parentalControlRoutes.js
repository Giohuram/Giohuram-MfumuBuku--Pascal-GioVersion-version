const express = require('express');
const parentalControlController = require('../controllers/parentalControlController');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const asyncHandler = require('../utils/asyncHandler')

router.get('/', parentalControlController.getAllParentalControls);
router.get('/:id', parentalControlController.getParentalControlById);
router.post('/', parentalControlController.createParentalControl);
router.put('/:id', parentalControlController.updateParentalControl);
router.delete('/:id', parentalControlController.deleteParentalControl);

module.exports = router;

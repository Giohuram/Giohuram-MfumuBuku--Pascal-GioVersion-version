const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler')

router.get('/', subscriptionController.getAllSubscriptions);
router.get('/:id', subscriptionController.getSubscriptionById);
router.post('/', subscriptionController.createSubscription);
router.put('/:id', subscriptionController.updateSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;

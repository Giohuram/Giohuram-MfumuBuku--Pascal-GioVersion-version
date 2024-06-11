// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const subscriptionService = require('../services/subscriptionService');

// const getAllSubscriptions = async (req, res) => {
//   try {
//     const subscriptions = await subscriptionService.getAllSubscriptions();
//     res.json(subscriptions);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getSubscriptionById = async (req, res) => {
//   try {
//     const subscription = await subscriptionService.getSubscriptionById(req.params.id);
//     if (!subscription) {
//       return res.status(404).json({ message: 'Subscription not found' });
//     }
//     res.json(subscription);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const createSubscription = async (req, res) => {
//   try {
//     const subscription = await subscriptionService.createSubscription(req.body);
//     res.status(201).json(subscription);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateSubscription = async (req, res) => {
//   try {
//     const subscription = await subscriptionService.updateSubscription(req.params.id, req.body);
//     res.json(subscription);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteSubscription = async (req, res) => {
//   try {
//     await subscriptionService.deleteSubscription(req.params.id);
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   getAllSubscriptions,
//   getSubscriptionById,
//   createSubscription,
//   updateSubscription,
//   deleteSubscription,
// };

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const asyncHandler = require('../utils/asyncHandler'); // Assuming common middleware for handling async

const getAllSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await prisma.subscription.findMany();
  res.json(subscriptions);
});

const getSubscriptionById = asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.findUnique({
    where: { id: parseInt(req.params.id) }
  });

  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  res.json(subscription);
});

const createSubscription = asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.create({ data: req.body });
  res.status(201).json(subscription);
});

const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await prisma.subscription.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });

  res.json(subscription);
});

const deleteSubscription = asyncHandler(async (req, res) => {
  await prisma.subscription.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.status(204).end();
});

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
};

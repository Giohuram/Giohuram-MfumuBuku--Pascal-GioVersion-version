// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const parentalControlService = require('../services/parentalControlService');

// const getAllParentalControls = async (req, res) => {
//   try {
//     const controls = await parentalControlService.getAllParentalControls();
//     res.json(controls);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getParentalControlById = async (req, res) => {
//   try {
//     const control = await parentalControlService.getParentalControlById(req.params.id);
//     if (!control) {
//       return res.status(404).json({ message: 'Parental control not found' });
//     }
//     res.json(control);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const createParentalControl = async (req, res) => {
//   try {
//     const control = await parentalControlService.createParentalControl(req.body);
//     res.status(201).json(control);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateParentalControl = async (req, res) => {
//   try {
//     const control = await parentalControlService.updateParentalControl(req.params.id, req.body);
//     res.json(control);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteParentalControl = async (req, res) => {
//   try {
//     await parentalControlService.deleteParentalControl(req.params.id);
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   getAllParentalControls,
//   getParentalControlById,
//   createParentalControl,
//   updateParentalControl,
//   deleteParentalControl,
// };

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const asyncHandler = require('../utils/asyncHandler'); // Assuming common middleware for handling async

const getAllParentalControls = asyncHandler(async (req, res) => {
  const controls = await prisma.parentalControl.findMany();
  res.json(controls);
});

const getParentalControlById = asyncHandler(async (req, res) => {
  const control = await prisma.parentalControl.findUnique({
    where: { id: parseInt(req.params.id) }
  });

  if (!control) {
    return res.status(404).json({ message: 'Parental control not found' });
  }

  res.json(control);
});

const createParentalControl = asyncHandler(async (req, res) => {
  const control = await prisma.parentalControl.create({ data: req.body });
  res.status(201).json(control);
});

const updateParentalControl = asyncHandler(async (req, res) => {
  const control = await prisma.parentalControl.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });

  res.json(control);
});

const deleteParentalControl = asyncHandler(async (req, res) => {
  await prisma.parentalControl.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.status(204).end();
});

module.exports = {
  getAllParentalControls,
  getParentalControlById,
  createParentalControl,
  updateParentalControl,
  deleteParentalControl
};

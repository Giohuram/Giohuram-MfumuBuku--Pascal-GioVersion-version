const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const readingHistoryService = require('../services/readingHistoryService');
const asyncHandler = require('../utils/asyncHandler'); // Assurez-vous que le chemin est correct

const getAllReadingHistories = async (req, res) => {
  try {
    const histories = await readingHistoryService.getAllReadingHistories();
    res.json(histories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReadingHistoryById = async (req, res) => {
  try {
    const history = await readingHistoryService.getReadingHistoryById(req.params.id);
    if (!history) {
      return res.status(404).json({ message: 'Reading history not found' });
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReadingHistory = async (req, res) => {
  try {
    const history = await readingHistoryService.createReadingHistory(req.body);
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReadingHistory = async (req, res) => {
  try {
    const history = await readingHistoryService.updateReadingHistory(req.params.id, req.body);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReadingHistory = async (req, res) => {
  try {
    await readingHistoryService.deleteReadingHistory(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour la dernière page lue
const updateLastPageRead = asyncHandler(async (req, res) => {
  const { userId, bookId, lastPageRead } = req.body;
  const readingHistory = await prisma.readingHistory.updateMany({
    where: { userId, bookId },
    data: { lastPageRead }
  });
  res.status(200).json(readingHistory);
});

// Récupérer la dernière page lue pour un livre spécifique
const getLastPageRead = asyncHandler(async (req, res) => {
  const { userId, bookId } = req.params;
  const readingHistory = await prisma.readingHistory.findFirst({
    where: { userId, bookId },
    select: { lastPageRead: true }
  });
  res.status(200).json(readingHistory);
});


module.exports = {
  getAllReadingHistories,
  getReadingHistoryById,
  createReadingHistory,
  updateReadingHistory,
  deleteReadingHistory,
  updateLastPageRead,
  getLastPageRead
};

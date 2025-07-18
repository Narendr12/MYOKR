const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const router = express.Router();

// Helper: Update OKR progress after key result change
async function updateOKRProgress(okrId) {
  const keyResults = await prisma.keyResult.findMany({ where: { okrId } });
  if (!keyResults.length) return;
  const total = keyResults.reduce((sum, kr) => sum + kr.targetValue, 0);
  const current = keyResults.reduce((sum, kr) => sum + kr.currentValue, 0);
  const progress = total === 0 ? 0 : (current / total) * 100;
  await prisma.okr.update({ where: { id: okrId }, data: { progress } });
}

// Create KeyResult
router.post('/', async (req, res) => {
  const { okrId, title, targetValue, currentValue, status } = req.body;
  try {
    const keyResult = await prisma.keyResult.create({ data: { okrId, title, targetValue, currentValue, status } });
    await updateOKRProgress(okrId);
    res.json(keyResult);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all KeyResults
router.get('/', async (req, res) => {
  const keyResults = await prisma.keyResult.findMany();
  res.json(keyResults);
});

// Get KeyResult by ID
router.get('/:id', async (req, res) => {
  const keyResult = await prisma.keyResult.findUnique({ where: { id: Number(req.params.id) } });
  if (!keyResult) return res.status(404).json({ error: 'Not found' });
  res.json(keyResult);
});

// Update KeyResult
router.put('/:id', async (req, res) => {
  const { title, targetValue, currentValue, status } = req.body;
  try {
    const keyResult = await prisma.keyResult.update({ where: { id: Number(req.params.id) }, data: { title, targetValue, currentValue, status } });
    await updateOKRProgress(keyResult.okrId);
    res.json(keyResult);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete KeyResult
router.delete('/:id', async (req, res) => {
  try {
    const keyResult = await prisma.keyResult.delete({ where: { id: Number(req.params.id) } });
    await updateOKRProgress(keyResult.okrId);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router; 
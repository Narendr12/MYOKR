const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const router = express.Router();

// Helper: Calculate OKR progress from key results
async function calculateProgress(okrId) {
  const keyResults = await prisma.keyResult.findMany({ where: { okrId } });
  if (!keyResults.length) return 0;
  const total = keyResults.reduce((sum, kr) => sum + kr.targetValue, 0);
  const current = keyResults.reduce((sum, kr) => sum + kr.currentValue, 0);
  return total === 0 ? 0 : (current / total) * 100;
}

// Create OKR
router.post('/', async (req, res) => {
  const { title, description, teamId, assignedUserId, startDate, endDate, createdBy } = req.body;
  try {
    const okr = await prisma.okr.create({
      data: { title, description, teamId, assignedUserId, startDate: new Date(startDate), endDate: new Date(endDate), createdBy },
    });
    res.json(okr);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all OKRs
router.get('/', async (req, res) => {
  const okrs = await prisma.okr.findMany({ include: { keyResults: true } });
  for (const okr of okrs) {
    okr.progress = await calculateProgress(okr.id);
  }
  res.json(okrs);
});

// Get OKR by ID
router.get('/:id', async (req, res) => {
  const okr = await prisma.okr.findUnique({ where: { id: Number(req.params.id) }, include: { keyResults: true } });
  if (!okr) return res.status(404).json({ error: 'Not found' });
  okr.progress = await calculateProgress(okr.id);
  res.json(okr);
});

// Update OKR
router.put('/:id', async (req, res) => {
  const { title, description, teamId, assignedUserId, startDate, endDate, status } = req.body;
  try {
    const okr = await prisma.okr.update({
      where: { id: Number(req.params.id) },
      data: { title, description, teamId, assignedUserId, startDate: new Date(startDate), endDate: new Date(endDate), status },
    });
    res.json(okr);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete OKR
router.delete('/:id', async (req, res) => {
  try {
    await prisma.okr.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router; 
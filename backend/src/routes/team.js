const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const router = express.Router();

// Create Team
router.post('/', async (req, res) => {
  const { name, departmentId } = req.body;
  try {
    const team = await prisma.team.create({ data: { name, departmentId } });
    res.json(team);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all Teams
router.get('/', async (req, res) => {
  const teams = await prisma.team.findMany();
  res.json(teams);
});

// Get Team by ID
router.get('/:id', async (req, res) => {
  const team = await prisma.team.findUnique({ where: { id: Number(req.params.id) } });
  if (!team) return res.status(404).json({ error: 'Not found' });
  res.json(team);
});

// Update Team
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const team = await prisma.team.update({ where: { id: Number(req.params.id) }, data: { name } });
    res.json(team);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete Team
router.delete('/:id', async (req, res) => {
  try {
    await prisma.team.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router; 
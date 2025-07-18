const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const router = express.Router();

// Create Organisation
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const org = await prisma.organisation.create({ data: { name } });
    res.json(org);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all Organisations
router.get('/', async (req, res) => {
  const orgs = await prisma.organisation.findMany();
  res.json(orgs);
});

// Get Organisation by ID
router.get('/:id', async (req, res) => {
  const org = await prisma.organisation.findUnique({ where: { id: Number(req.params.id) } });
  if (!org) return res.status(404).json({ error: 'Not found' });
  res.json(org);
});

// Update Organisation
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const org = await prisma.organisation.update({ where: { id: Number(req.params.id) }, data: { name } });
    res.json(org);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete Organisation
router.delete('/:id', async (req, res) => {
  try {
    await prisma.organisation.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router; 
const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const router = express.Router();

// Create Department
router.post('/', async (req, res) => {
  const { name, organisationId } = req.body;
  try {
    const dept = await prisma.department.create({ data: { name, organisationId } });
    res.json(dept);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all Departments
router.get('/', async (req, res) => {
  const depts = await prisma.department.findMany();
  res.json(depts);
});

// Get Department by ID
router.get('/:id', async (req, res) => {
  const dept = await prisma.department.findUnique({ where: { id: Number(req.params.id) } });
  if (!dept) return res.status(404).json({ error: 'Not found' });
  res.json(dept);
});

// Update Department
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const dept = await prisma.department.update({ where: { id: Number(req.params.id) }, data: { name } });
    res.json(dept);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete Department
router.delete('/:id', async (req, res) => {
  try {
    await prisma.department.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router; 
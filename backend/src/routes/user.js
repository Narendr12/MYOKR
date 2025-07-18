const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const router = express.Router();

// Create User
router.post('/', async (req, res) => {
  const { name, email, password, role, teamId } = req.body;
  try {
    const user = await prisma.user.create({ data: { name, email, password, role, teamId } });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all Users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get User by ID
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// Update User
router.put('/:id', async (req, res) => {
  const { name, email, role, teamId } = req.body;
  try {
    const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { name, email, role, teamId } });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router; 
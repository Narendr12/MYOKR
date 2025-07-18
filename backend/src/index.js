const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('../src/generated/prisma');
const authRouter = require('./routes/auth');
const organisationRouter = require('./routes/organisation');
const departmentRouter = require('./routes/department');
const teamRouter = require('./routes/team');
const userRouter = require('./routes/user');
const okrRouter = require('./routes/okr');
const keyResultRouter = require('./routes/keyresult');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/organisations', organisationRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/teams', teamRouter);
app.use('/api/users', userRouter);
app.use('/api/okrs', okrRouter);
app.use('/api/keyresults', keyResultRouter);

app.get('/', (req, res) => {
  res.send('MyOKR Backend API is running!');
});

// Placeholder for auth, org, department, team, user, okr, keyresult routes

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
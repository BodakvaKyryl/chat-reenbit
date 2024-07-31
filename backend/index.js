const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authController = require('./controllers/AuthController');
const userController = require('./controllers/UserController');
const ConversationRouter = require('./controllers/ConversationController');
const dotenv = require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/auth', authController);
app.use('/user', userController);
app.use('/conversation', ConversationRouter);

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const verifyToken = require('../middleware/verifyToken');
const Message = require('../models/Message');
const MessageController = require('express').Router();

MessageController.post('/', verifyToken, async (req, res) => {
  try {
    const { messageText, conversationId } = req.body;
    const newMessage = await Message.create({ messageText, senderId: req.user.id, conversationId });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
  }
});

MessageController.get('/:convoId', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.convoId });
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
  }
});

module.exports = MessageController;

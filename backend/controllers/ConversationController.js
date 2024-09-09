const verifyToken = require('../middleware/verifyToken');
const Conversation = require('../models/Conversation');
const ConversationRouter = require('express').Router();

ConversationRouter.post('/', verifyToken, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const currentUser = req.user.id;
    const isConversationExist = await Conversation.findOne({ members: { $all: [receiverId, currentUser] } });

    if (isConversationExist) return res.status(500).json({ msg: 'Conversation already exist' });
    else {
      await Conversation.create({ members: [currentUser, receiverId] });
      return res.status(201).json({ msg: 'Conversation created' });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

ConversationRouter.get('/find/:userId', verifyToken, async (req, res) => {
  if (req.user.id === req.params.userId) {
    try {
      const currentUserId = req.user.id;
      const conversations = await Conversation.find({ members: { $in: [currentUserId] } });

      return res.status(200).json(conversations);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  } else return res.status(403).json({ msg: 'You can get only your conversations' });
});

ConversationRouter.get('/:convoId', verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.convoId);
    
    if (conversation.members.includes(req.user.id)) return res.status(200).json(conversation);
    else return res.status(403).json({ msg: 'You can get only your conversations' });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = ConversationRouter;

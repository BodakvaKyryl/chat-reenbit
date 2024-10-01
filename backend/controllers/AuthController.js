const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = require('express').Router();

authController.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (username === '' || email === '' || password === '') {
      return res.status(500).json({ msg: 'All fields are required' });
    }

    const isExist = await User.findOne({ email });
    if (isExist) return res.status(500).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });

    const { password: pwd, ...others } = user._doc;
    const token = createToken(user);

    return res.status(200).json({ token, user: others });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error in register' });
  }
});

authController.post('/login', async (req, res) => {
  try {
    if (req.body.email === '' || req.body.password === '') {
      return res.status(500).json({ msg: 'All fields are required' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(500).json({ msg: 'Email or password is incorrect' });

    const comparePath = await bcrypt.compare(req.body.password, user.password);
    if (!comparePath) return res.status(500).json({ msg: 'Incorrect password' });

    const { password, ...others } = user._doc;
    const token = createToken(others);

    return res.status(200).json({ token, others });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error in login' });
  }
});

const createToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: '30d',
  });

  return token;
};

module.exports = authController;

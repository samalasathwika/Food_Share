const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// Admin login (hidden route - no frontend indicator)
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ isAdmin: true, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: { _id: 'admin', name: 'Admin', email, role: 'admin' },
    });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, organization } = req.body;

    // Prevent admin registration via API
    if (role === 'admin') return res.status(400).json({ message: 'Invalid role' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role, phone, address, organization });

    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check admin credentials silently
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ isAdmin: true, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: { _id: 'admin', name: 'Admin', email, role: 'admin' },
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isActive) return res.status(403).json({ message: 'Account has been deactivated' });

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, phone: user.phone, address: user.address,
        isVerified: user.isVerified, organization: user.organization,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (req.user.isAdmin) return res.json(req.user);
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, organization } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, organization },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

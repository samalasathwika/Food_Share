const User = require('../models/User');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const Delivery = require('../models/Delivery');
const Review = require('../models/Review');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const activeDonations = await Donation.countDocuments({ status: 'available' });
    const deliveredDonations = await Donation.countDocuments({ status: 'delivered' });
    const totalUsers = await User.countDocuments();
    const totalNGOs = await User.countDocuments({ role: { $in: ['ngo', 'orphanage', 'oldagehome'] } });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const pendingVerifications = await User.countDocuments({ isVerified: false, role: { $ne: 'admin' } });
    const totalRequests = await Request.countDocuments();

    // Monthly donations for chart
    const monthlyData = await Donation.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    // Category breakdown
    const categoryData = await Donation.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      totalDonations, activeDonations, deliveredDonations,
      totalUsers, totalNGOs, totalVolunteers, totalDonors,
      pendingVerifications, totalRequests, monthlyData, categoryData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor', 'name email organization');
    const requests = await Request.find()
      .populate('donation', 'title category')
      .populate('ngo', 'name email')
      .populate('donor', 'name email');
    const deliveries = await Delivery.find()
      .populate('donation', 'title')
      .populate('volunteer', 'name email');
    res.json({ donations, requests, deliveries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

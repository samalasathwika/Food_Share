const Donation = require('../models/Donation');
const Request = require('../models/Request');
const Delivery = require('../models/Delivery');

exports.getPublicStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const delivered = await Donation.countDocuments({ status: 'delivered' });
    const active = await Donation.countDocuments({ status: 'available' });

    const User = require('../models/User');
    const activeNGOs = await User.countDocuments({ role: { $in: ['ngo', 'orphanage', 'oldagehome'] }, isActive: true });
    const activeVolunteers = await User.countDocuments({ role: 'volunteer', isActive: true });

    // Estimate meals saved (each kg ~ 4 meals)
    const categoryData = await Donation.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const monthlyData = await Donation.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 },
    ]);

    res.json({
      totalDonations, delivered, active,
      activeNGOs, activeVolunteers,
      mealsServed: delivered * 20,
      foodSavedKg: delivered * 5,
      categoryData, monthlyData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

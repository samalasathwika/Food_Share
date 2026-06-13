const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');

exports.createDonation = async (req, res) => {
  try {
    const { title, description, category, quantity, quantityUnit, expiryTime, pickupAddress, priorityLevel, servingsEstimate, isEmergency } = req.body;

    const donation = await Donation.create({
      title, description, category, quantity, quantityUnit,
      expiryTime, pickupAddress, priorityLevel, servingsEstimate, isEmergency,
      donor: req.user._id,
      image: req.file ? req.file.path : null,
    });

    // Generate QR code
    const qrData = JSON.stringify({ donationId: donation._id, title, donor: req.user._id });
    const qrCode = await QRCode.toDataURL(qrData);
    donation.qrCode = qrCode;
    await donation.save();

    // Notify all NGOs
    const User = require('../models/User');
    const ngos = await User.find({ role: { $in: ['ngo', 'orphanage', 'oldagehome'] } });
    for (const ngo of ngos) {
      const notif = await Notification.create({
        user: ngo._id,
        message: `New ${isEmergency ? 'EMERGENCY ' : ''}food donation: ${title}`,
        type: isEmergency ? 'emergency' : 'donation',
        link: `/donations/${donation._id}`,
      });
      req.io.to(ngo._id.toString()).emit('notification', notif);
    }

    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const { category, status, search, emergency } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = 'available';
    if (emergency === 'true') filter.isEmergency = true;
    if (search) filter.title = { $regex: search, $options: 'i' };

    // Filter out expired
    filter.expiryTime = { $gt: new Date() };

    const donations = await Donation.find(filter)
      .populate('donor', 'name email phone organization address')
      .sort({ isEmergency: -1, priorityLevel: -1, createdAt: -1 });

    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone organization address');
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await donation.deleteOne();
    res.json({ message: 'Donation removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDonationsAdmin = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email organization')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

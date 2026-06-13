const Request = require('../models/Request');
const Donation = require('../models/Donation');
const Delivery = require('../models/Delivery');
const Notification = require('../models/Notification');

exports.createRequest = async (req, res) => {
  try {
    const { donationId, message, needsDelivery, pickupTime } = req.body;

    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.status !== 'available') return res.status(400).json({ message: 'Donation not available' });

    const existing = await Request.findOne({ donation: donationId, ngo: req.user._id, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'You already have a pending request' });

    const request = await Request.create({
      donation: donationId,
      ngo: req.user._id,
      donor: donation.donor,
      message, needsDelivery, pickupTime,
    });

    donation.status = 'requested';
    await donation.save();

    const notif = await Notification.create({
      user: donation.donor,
      message: `New food request from ${req.user.name} for "${donation.title}"`,
      type: 'request',
      link: `/donor/requests`,
    });
    req.io.to(donation.donor.toString()).emit('notification', notif);

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ ngo: req.user._id })
      .populate('donation')
      .populate('donor', 'name email phone organization')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDonorRequests = async (req, res) => {
  try {
    const requests = await Request.find({ donor: req.user._id })
      .populate('donation')
      .populate('ngo', 'name email phone organization address')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('donation');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = 'approved';
    await request.save();

    request.donation.status = 'approved';
    await request.donation.save();

    // Create delivery if needed
    if (request.needsDelivery) {
      await Delivery.create({
        request: request._id,
        donation: request.donation._id,
        pickupLocation: request.donation.pickupAddress,
        dropLocation: 'NGO Address',
        status: 'pending',
      });
    }

    const notif = await Notification.create({
      user: request.ngo,
      message: `Your food request for "${request.donation.title}" has been approved!`,
      type: 'request',
    });
    req.io.to(request.ngo.toString()).emit('notification', notif);

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('donation');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    request.donation.status = 'available';
    await request.donation.save();

    const notif = await Notification.create({
      user: request.ngo,
      message: `Your food request for "${request.donation.title}" was rejected.`,
      type: 'request',
    });
    req.io.to(request.ngo.toString()).emit('notification', notif);

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRequestsAdmin = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('donation', 'title category')
      .populate('ngo', 'name email')
      .populate('donor', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

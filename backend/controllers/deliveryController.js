const Delivery = require('../models/Delivery');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

exports.getPendingDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: 'pending', volunteer: null })
      .populate({ path: 'donation', populate: { path: 'donor', select: 'name phone' } })
      .populate({ path: 'request', populate: { path: 'ngo', select: 'name phone address' } });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.acceptDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    if (delivery.volunteer) return res.status(400).json({ message: 'Delivery already accepted' });

    delivery.volunteer = req.user._id;
    delivery.status = 'accepted';
    delivery.acceptedAt = new Date();
    await delivery.save();

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, qrScanned } = req.body;
    const delivery = await Delivery.findById(req.params.id).populate('donation');

    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    if (delivery.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    delivery.status = status;
    if (status === 'picked_up') {
      delivery.pickedUpAt = new Date();
      delivery.pickupQrScanned = qrScanned || false;
      delivery.donation.status = 'picked_up';
      await delivery.donation.save();
    }
    if (status === 'delivered') {
      delivery.deliveredAt = new Date();
      delivery.deliveryQrScanned = qrScanned || false;
      delivery.donation.status = 'delivered';
      await delivery.donation.save();
    }

    await delivery.save();
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ volunteer: req.user._id })
      .populate('donation')
      .populate({ path: 'request', populate: { path: 'ngo', select: 'name phone address' } })
      .sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.scanQR = async (req, res) => {
  try {
    const { donationId, type } = req.body;
    const delivery = await Delivery.findOne({ donation: donationId, volunteer: req.user._id });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    if (type === 'pickup') {
      delivery.pickupQrScanned = true;
      delivery.status = 'picked_up';
      delivery.pickedUpAt = new Date();
    } else if (type === 'delivery') {
      delivery.deliveryQrScanned = true;
      delivery.status = 'delivered';
      delivery.deliveredAt = new Date();
    }

    await delivery.save();
    res.json({ message: 'QR scanned successfully', delivery });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

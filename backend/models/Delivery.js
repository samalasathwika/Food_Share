const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered'],
    default: 'pending',
  },
  pickupQrScanned: { type: Boolean, default: false },
  deliveryQrScanned: { type: Boolean, default: false },
  acceptedAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);

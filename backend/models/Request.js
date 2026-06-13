const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  needsDelivery: { type: Boolean, default: false },
  pickupTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

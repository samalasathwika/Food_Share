const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Bakery Items', 'Fruits', 'Vegetables', 'Dairy Products', 'Beverages', 'Packed Food'],
    required: true,
  },
  quantity: { type: String, required: true },
  quantityUnit: { type: String, enum: ['kg', 'litres', 'packets', 'servings', 'boxes'], default: 'kg' },
  expiryTime: { type: Date, required: true },
  image: { type: String },
  pickupAddress: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['available', 'requested', 'approved', 'picked_up', 'delivered', 'expired', 'cancelled'],
    default: 'available',
  },
  qrCode: { type: String },
  priorityLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium',
  },
  isEmergency: { type: Boolean, default: false },
  servingsEstimate: { type: Number },
}, { timestamps: true });

donationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donation', donationSchema);

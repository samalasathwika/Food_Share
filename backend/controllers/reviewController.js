const Review = require('../models/Review');
const User = require('../models/User');

exports.createReview = async (req, res) => {
  try {
    const { revieweeId, rating, comment, type, donationId } = req.body;

    const existing = await Review.findOne({ reviewer: req.user._id, reviewee: revieweeId, donation: donationId });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating, comment, type,
      donation: donationId,
    });

    // Update user rating
    const reviews = await Review.find({ reviewee: revieweeId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(revieweeId, { rating: avg.toFixed(1), totalRatings: reviews.length });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name organization')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

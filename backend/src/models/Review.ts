import mongoose, { Document, Schema } from 'mongoose';
import { Review, ReviewCategory } from '@/types';

export interface IReview extends Omit<Review, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const ReviewCategorySchema = new Schema<ReviewCategory>({
  category: {
    type: String,
    enum: ['cleanliness', 'communication', 'respect_house_rules', 'check_in', 'accuracy', 'location', 'value'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
}, { _id: false });

const ReviewSchema = new Schema<IReview>({
  type: {
    type: String,
    enum: ['host-to-guest', 'guest-to-host'],
    required: true
  },
  status: {
    type: String,
    enum: ['published', 'pending', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  publicReview: {
    type: String,
    required: true,
    trim: true
  },
  privateReview: {
    type: String,
    trim: true
  },
  reviewCategory: [ReviewCategorySchema],
  submittedAt: {
    type: String,
    required: true
  },
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  listingName: {
    type: String,
    required: true,
    trim: true
  },
  listingId: {
    type: String,
    trim: true
  },
  channel: {
    type: String,
    enum: ['airbnb', 'booking', 'hostaway', 'google', 'direct'],
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  response: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret) {
      ret.id = ret._id.toString();
      delete (ret as any)._id;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indexes for better query performance
ReviewSchema.index({ listingId: 1 });
ReviewSchema.index({ channel: 1 });
ReviewSchema.index({ isApproved: 1 });
ReviewSchema.index({ isPublic: 1 });
ReviewSchema.index({ submittedAt: -1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ guestName: 'text', publicReview: 'text' });

export const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);

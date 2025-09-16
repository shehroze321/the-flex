import mongoose, { Document, Schema } from 'mongoose';
import { Property } from '@/types';

export interface IProperty extends Omit<Property, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const PropertySchema = new Schema<IProperty>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  features: {
    bedrooms: {
      type: Number,
      min: 0
    },
    bathrooms: {
      type: Number,
      min: 0
    },
    sqft: {
      type: Number,
      min: 0
    },
    guests: {
      type: Number,
      min: 1
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  pricePerNight: {
    type: Number,
    min: 0
  },
  availability: {
    type: String,
    trim: true
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastReviewDate: {
    type: String
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
PropertySchema.index({ name: 'text', address: 'text', city: 'text' });
PropertySchema.index({ isActive: 1 });
PropertySchema.index({ averageRating: -1 });
PropertySchema.index({ totalReviews: -1 });

export const PropertyModel = mongoose.model<IProperty>('Property', PropertySchema);

import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemsCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    //create date
    timestamps: true,
  },
);

export default mongoose.model('Collection', CollectionSchema);

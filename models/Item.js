import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
    collectionName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      required: true,
    },
  },
  {
    //create date
    timestamps: true,
  },
);

export default mongoose.model('Item', ItemSchema);

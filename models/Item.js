import mongoose, { Schema } from 'mongoose';

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  ],
  in_stock: { type: Number, required: true },
  last_modified: { type: Date, required: true },
  img_url: { type: String, default: '' },
});

ItemSchema.virtual('url').get(function () {
  return `/items/${this._id}`;
});

export default mongoose.model('Item', ItemSchema);

import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
});

CategorySchema.virtual('url').get(function () {
  return `/categories/${this._id}`;
});

export default mongoose.model('Category', CategorySchema);

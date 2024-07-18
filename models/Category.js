import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
});

export default mongoose.model('Category', CategorySchema);

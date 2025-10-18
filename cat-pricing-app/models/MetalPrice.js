import mongoose, { Schema } from 'mongoose';

const MetalPriceSchema = new Schema({
  asOfDate: { type: Date, required: true, unique: true },
  pt_per_gram: { type: Number, required: true },
  pd_per_gram: { type: Number, required: true },
  rh_per_gram: { type: Number, required: true },
  source: { type: String, default: 'internal' },
  currency: { type: String, default: 'USD' }
}, { timestamps: true });

export default mongoose.models.MetalPrice || mongoose.model('MetalPrice', MetalPriceSchema);

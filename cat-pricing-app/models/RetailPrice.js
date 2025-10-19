import mongoose, { Schema } from 'mongoose';

const RetailPriceSchema = new Schema(
  {
    partNumber: { type: String, required: true, index: true },
    make: { type: String },
    price: { type: Number, required: true },
    unit: { type: String, default: 'EA' },
    effectiveDate: { type: Date, default: () => new Date() },
    sourceDoc: { type: String }, // optional filename
  },
  { timestamps: true }
);

RetailPriceSchema.index({ partNumber: 1, effectiveDate: -1 });

export default mongoose.models.RetailPrice || mongoose.model('RetailPrice', RetailPriceSchema);

import mongoose, { Schema } from 'mongoose';

const ConverterSchema = new Schema({
  partNumber: { type: String, required: true, unique: true, index: true },
  aliases: { type: [String], default: [] },
  oemMake: { type: String },
  category: { type: String, enum: ['CAT','DPF','DOC'], default: 'CAT' },
  metalContent: {
    pt_g: { type: Number, required: true },
    pd_g: { type: Number, required: true },
    rh_g: { type: Number, required: true }
  },
  recoveryRate: { type: Number, default: 0.9 },
  status: { type: String, enum: ['active','inactive'], default: 'active' },
  notes: String,
}, { timestamps: true });

export default mongoose.models.Converter || mongoose.model('Converter', ConverterSchema);

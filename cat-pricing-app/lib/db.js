import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set');
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: 'cat_pricing' }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

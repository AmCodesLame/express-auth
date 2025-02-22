import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  work: { type: String },
  dob: { type: Date },
  age: { type: Number },
  briefDescription: { type: String },
  is_admin: { type: Boolean, default: false },
  is_verified: { type: Boolean, default: false },
  is_updated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;
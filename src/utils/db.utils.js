import mongoose from 'mongoose';
import dbConfig from '../config/db.config.js';

const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.url);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;

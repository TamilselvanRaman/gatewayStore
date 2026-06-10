const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('DEBUG: MONGODB_URI type:', typeof process.env.MONGODB_URI);
    if (process.env.MONGODB_URI) {
      console.log('DEBUG: MONGODB_URI starts with:', process.env.MONGODB_URI.substring(0, 30));
      console.log('DEBUG: MONGODB_URI length:', process.env.MONGODB_URI.length);
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gateway_store');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
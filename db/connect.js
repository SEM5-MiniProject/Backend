const mongoose = require('mongoose');
const log = require('../log');

const connectDB = async ()=> {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    log.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;

import mongoose from "mongoose";
import config from 'config';
const index = config.get('mongoURI');
const connectDB = async () => {
  try {
    await mongoose.connect(index, {
      authSource: "admin",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 4
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;

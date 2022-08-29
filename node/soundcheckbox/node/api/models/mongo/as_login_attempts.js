import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};

const as_login_attempts = new mongoose.Schema({
  id_login_attempts: {
    type: DataTypes.INTEGER,
    required: true,
  },
  ip_addr: {
    type: DataTypes.STRING,
    maxLength: 20,
    required: true,
  },
  attempt_number: {
    type: DataTypes.INTEGER,
    required: true,
    default: 1
  },
  date: {
    type: DataTypes.DATEONLY,
    required: true,
  }
});

export default mongoose.model('as_login_attempts', as_login_attempts);

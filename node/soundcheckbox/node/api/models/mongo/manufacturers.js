import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};

const manufacturers = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true,
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true
  },
  description: {
    type: DataTypes.STRING,
    maxLength: 1000,
    required: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true,
    default: 1
  }
});

export default mongoose.model('manufacturers', manufacturers);

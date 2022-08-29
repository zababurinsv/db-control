import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
  TINYINT: DataTypesMongoose.Number,
};

const equipment_categories = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    required: true,
    default: 0
  },
  order_index: {
    type: DataTypes.TINYINT,
    min: -128,
    max: 255,
    required: true
  }
});

export default mongoose.model('equipment_categories', equipment_categories);

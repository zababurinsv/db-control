import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};


const menu_presets = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: false
  },
  JSON: {
    type: DataTypes.TEXT,
    required: true
  },
  image: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    default: "''"
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true
  },
  order: {
    type: DataTypes.INTEGER,
    required: true,
    default: 0
  }
});

export default mongoose.model('menu_presets', menu_presets);

import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};

const menu_tags = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 50,
    required: true,
    unique: "name"
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true
  },
  locale: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false
  },
  class: {
    type: DataTypes.INTEGER,
    required: true,
    default: 1
  }
});

export default mongoose.model('menu_tags', menu_tags);

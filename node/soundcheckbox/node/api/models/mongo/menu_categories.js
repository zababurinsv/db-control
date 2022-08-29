import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};

const menu_categories = new mongoose.Schema({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    required: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: true,
    unique: "name"
  },
  image: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false
  },
  parent: {
    type: DataTypes.INTEGER,
    required: true,
    default: 0
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true,
    default: 1
  },
  locale: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false
  },
  order: {
    type: DataTypes.INTEGER,
    required: true
  }
});

export default mongoose.model('menu_categories', menu_categories);

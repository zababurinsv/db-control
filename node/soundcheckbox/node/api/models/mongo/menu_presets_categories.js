import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};


const menu_presets_categories = new mongoose.Schema({
  preset_id: {
    type: DataTypes.INTEGER,
    required: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    required: true,
  }
});

export default mongoose.model('menu_presets_categories', menu_presets_categories);

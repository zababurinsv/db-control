import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
  SMALLINT: DataTypesMongoose.Number,
};

const equipment_types = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true,
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: true
  },
  order_index: {
    type: DataTypes.SMALLINT,
    min: -32768,
    max: 65535,
    required: true
  }
})

export default mongoose.model('equipment_types', equipment_types);

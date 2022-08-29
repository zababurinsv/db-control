import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};

const events = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    required: true,
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 255,
    allowNull: true
  },
  create_date: {
    type: DataTypes.DATE,
    required: true
  },
  change_date: {
    type: DataTypes.DATE,
    required: true
  },
  start_date: {
    type: DataTypes.DATE,
    required: true
  },
  end_date: {
    type: DataTypes.DATE,
    required: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true
  },
  description: {
    type: DataTypes.TEXT,
    required: true
  },
  venue_id: {
    type: DataTypes.INTEGER,
    required: true
  },
  riders_count: {
    type: DataTypes.INTEGER,
    required: true,
    default: 1
  }
});

export default mongoose.model('events', events);

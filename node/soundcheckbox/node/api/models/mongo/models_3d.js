import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};

const models_3d = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true,
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: true,
    unique: "name"
  },
  model_src: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true
  },
  image: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true
  },
  create_date: {
    type: DataTypes.DATE,
    required: false
  },
  change_date: {
    type: DataTypes.DATE,
    required: false
  }
});

export default mongoose.model('models_3d', models_3d);

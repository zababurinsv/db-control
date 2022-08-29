import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};

const as_user_roles = new mongoose.Schema({
  role_id: {
    type: DataTypes.INTEGER,
    required: true,
    unique: true,
  },
  role: {
    type: DataTypes.STRING,
    maxLength: 20,
    required: true,
  }
});

export default mongoose.model('as_user_roles', as_user_roles);

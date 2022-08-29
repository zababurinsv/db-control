import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};

const as_social_logins = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true,
    ref: 'id'
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true
  },
  provider: {
    type: DataTypes.STRING,
    maxLength: 50,
    required: false,
    default: "email"
  },
  provider_id: {
    type: DataTypes.STRING,
    maxLength: 250,
    required: false
  },
  createdAt: {
    type: DataTypes.STRING,
    required: false
  }
});

export default mongoose.model('as_social_logins', as_social_logins);

import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};


const as_users = new mongoose.Schema({
  user_id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true
  },
  email: {
    type: DataTypes.STRING,
    maxLength: 40,
    required: true
  },
  username: {
    type: DataTypes.STRING,
    maxLength: 250,
    required: true
  },
  password: {
    type: DataTypes.STRING,
    maxLength: 250,
    required: true
  },
  confirmation_key: {
    type: DataTypes.STRING,
    maxLength: 40,
    required: false
  },
  confirmed: {
    type: DataTypes.STRING,
    required: true,
    enum : ['Y','N'],
    default: 'N'
  },
  password_reset_key: {
    type: DataTypes.STRING,
    maxLength: 250,
    required: false,
    default: ""
  },
  password_reset_confirmed: {
    type: DataTypes.STRING,
    required: true,
    enum : ['Y','N'],
    default: 'N'
  },
  password_reset_timestamp: {
    type: DataTypes.DATE,
    required: false
  },
  register_date: {
    type: DataTypes.DATEONLY,
    required: true
  },
  user_role: {
    type: DataTypes.INTEGER,
    required: true,
    default: 1
  },
  last_login: {
    type: DataTypes.DATE,
    required: false
  },
  banned: {
    type: DataTypes.STRING,
    required: true,
    enum : ['Y','N'],
    default: 'N'
  }
});

export default mongoose.model('as_users', as_users);

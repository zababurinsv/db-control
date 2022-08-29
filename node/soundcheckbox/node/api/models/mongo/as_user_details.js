import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
  BOOLEAN: DataTypesMongoose.Boolean,
};

const as_user_details = new mongoose.Schema({
  id_user_details: {
    type: DataTypes.INTEGER,
    required: true,
    unique: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true,
  },
  first_name: {
    type: DataTypes.STRING,
    maxLength: 35,
    required: false,
    default: ""
  },
  last_name: {
    type: DataTypes.STRING,
    maxLength: 35,
    required: false,
    default: ""
  },
  phone: {
    type: DataTypes.STRING,
    maxLength: 30,
    required: false,
    default: ""
  },
  address: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    default: ""
  },
  band_name: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    default: ""
  },
  band_logo: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    default: "'\/img\/ridertext\/Bel_KIRP.jpg'"
  },
  public_details: {
    type: DataTypes.TEXT,
    required: false,
  },
  private_details: {
    type: DataTypes.TEXT,
    required: false,
  },
  is_rentcompany: {
    type: DataTypes.BOOLEAN,
    required: true,
    default: 0
  },
  company_name: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
  },
  basic_location: {
    type: DataTypes.STRING,
    maxLength: 22,
    required: false,
  },
  basic_location_name: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
  },
  basic_location_radius: {
    type: DataTypes.INTEGER,
    required: true,
    default: 100
  }
});

export default mongoose.model('as_user_details', as_user_details);

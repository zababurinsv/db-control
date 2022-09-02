import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

/*
String
Number:
Boolean:
DocumentArray:
Subdocument:
Buffer:
Array:
Date:
ObjectId:
Mixed:
Decimal:
Decimal128:
Map:
Oid:
Object:
Bool:
ObjectID:

   maxLength: 50,
    required: true,
     id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true,
    ref: 'id'
  },
 */

const DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
  DATEONLY: DataTypesMongoose.Date,
};

const riders = new mongoose.Schema({
  id: {
    type: DataTypesMongoose.ObjectId,
    unique: true,
    index: true,
    required: true,
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 100,
    required: false
  },
  JSON: {
    type: DataTypes.TEXT,
    required: true
  },
  create_date: {
    type: DataTypes.DATE,
    required: false
  },
  change_date: {
    type: DataTypes.DATE,
    required: false
  },
  status: {
    type: DataTypes.STRING,
    required: true,
    enum : ['new', 'sent', 'proposed', 'accepted', 'discussed', 'deleted', 'public'],
    default: 'new'
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true
  },
  title: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false
  },
  published_date: {
    type: DataTypes.DATE,
    required: false
  },
  version_number: {
    type: DataTypes.INTEGER,
    required: true
  },
  origin_version_id: {
    type: DataTypes.INTEGER,
    required: true,
    default: 0
  },
  contact: {
    type: DataTypes.STRING,
    maxLength: 50,
    required: false
  },
  phone: {
    type: DataTypes.STRING,
    maxLength: 30,
    required: false
  },
  email: {
    type: DataTypes.STRING,
    maxLength: 50,
    required: false
  },
  band_name: {
    type: DataTypes.STRING,
    maxLength: 50,
    required: false
  },
  band_logo: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: false,
    default: "\/img\/ridertext\/IMG-20180913-WA0005.jpg"
  }
});

export default mongoose.model('riders', riders);

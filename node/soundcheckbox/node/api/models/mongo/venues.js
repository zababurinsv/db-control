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

const venues = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true,
    ref: 'id'
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true
  },
  country_code: {
    type: DataTypes.STRING,
    maxLength: 3,
    required: true
  },
  address: {
    type: DataTypes.STRING,
    maxLength: 255,
    required: true
  },
  stage_JSON: {
    type: DataTypes.TEXT,
    required: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true
  }
});

export default mongoose.model('venues', venues);

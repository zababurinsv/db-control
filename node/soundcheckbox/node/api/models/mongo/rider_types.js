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

const rider_types = new mongoose.Schema({
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true
  },
  name: {
    type: DataTypes.STRING,
    maxLength: 30,
    required: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    required: true,
    default: 1
  }
});

export default mongoose.model('rider_types', rider_types);

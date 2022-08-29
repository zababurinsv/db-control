import mongoose from "mongoose";
const DataTypesMongoose = mongoose.Schema.Types;

let DataTypes = {
  INTEGER: DataTypesMongoose.Number,
  STRING: DataTypesMongoose.String,
  TEXT: DataTypesMongoose.String,
  DATE: DataTypesMongoose.Date,
};

const as_comments = new mongoose.Schema({
  comment_id: {
    type: DataTypes.INTEGER,
    unique: true,
    index: true,
    required: true
  },
  posted_by: {
    type: DataTypes.INTEGER,
    required: true,
  },
  posted_by_name: {
    type: DataTypes.STRING,
    maxLength: 30,
    required: true,
  },
  comment: {
    type: DataTypes.TEXT,
    required: true,
  },
  post_time: {
    type: DataTypes.DATE,
    required: true,
  }
});

export default mongoose.model('as_comments', as_comments);

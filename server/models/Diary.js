// models/Diary.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diarySchema = mongoose.Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    maxlength: 50
  },
  description: {
    type: String
  },
  privacy: {
    type: Number // Keep this as a Number to match the frontend options
  },
  category: {
    type: Number // Change to a Number
  },
  genre: {
    type: Number // Change to a Number
  },
  rating: {
    type: Number
  },
  filePath: {
    type: String
  },
  fileName: {
    type: String
  }
}, { timestamps: true });

const Diary = mongoose.model('Diary', diarySchema);

module.exports = { Diary };
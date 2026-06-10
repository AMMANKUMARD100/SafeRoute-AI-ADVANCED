const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^(\+91|91)?[6-9]\d{9}$/, 'Enter a valid Indian mobile number, with or without country code'],
    },
    emergencyContacts: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        relationship: { type: String, required: true },
      },
    ],
    preferences: {
      language: {
        type: String,
        enum: ['en', 'hi', 'ta'],
        default: 'en',
      },
      nightModeAuto: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

export const User = mongoose.model("User", userSchema)
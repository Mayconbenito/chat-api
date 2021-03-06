import mongoose from "mongoose";

const wsSchema = new mongoose.Schema({
  type: Object,
  token: String,
  socket: {
    id: String,
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: "inactive" },
  },
  createdAt: Date,
});

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
  picture: {
    type: Object,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  contacts: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  ],
  ws: { type: [wsSchema], select: false },
});

export default mongoose.model("User", schema, "users");

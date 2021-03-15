import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema({
  address: {
    host: {
      required: true,
      type: String,
    },
    port: {
      required: true,
      type: Number,
    },
    origin: {
      required: true,
      type: String,
    },
    protocol: {
      required: true,
      type: String,
    },
  },
});

const NodeModel = mongoose.model("nodes", NodeSchema);

export default NodeModel;

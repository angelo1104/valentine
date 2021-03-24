import mongoose, { Schema } from "mongoose";
import { randomInt } from "crypto";

const NodeSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  lastBlock: {
    index: {
      required: true,
      type: Number,
    },
    data: {
      required: true,
      type: Schema.Types.Mixed,
    },
    nonce: {
      required: true,
      type: Number,
    },
    timestamp: {
      required: true,
      type: Number,
    },
    prevHash: {
      required: true,
      type: String,
    },
    difficulty: {
      required: true,
      type: Number,
    },
  },
  lastConnected: {
    required: true,
    type: Number,
  },
});

const NodeModel = mongoose.model(`nodes${randomInt(0, 50)}`, NodeSchema);

export default NodeModel;

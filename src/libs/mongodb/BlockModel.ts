import mongoose, { Schema } from "mongoose";

const BlockSchema = new mongoose.Schema({
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
  hash: {
    required: true,
    type: String,
  },
});

const BlockModel = mongoose.model("chain", BlockSchema);

export default BlockModel;

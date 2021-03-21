import mongoose from "mongoose";

const getLengthOfChain = async (
  Model: mongoose.Model<any>,
): Promise<number> => {
  try {
    return await Model.countDocuments().exec();
  } catch (e) {
    throw new Error(e.message);
  }
};

export default getLengthOfChain;

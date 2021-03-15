import mongoose from "mongoose";

const getLengthOfChain = async (
  Model: mongoose.Model<any>,
): Promise<number> => {
  try {
    const count = await Model.countDocuments().exec();
    return count;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default getLengthOfChain;

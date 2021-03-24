import mongoose from "mongoose";

const paginate = async (
  numberPerPage: number,
  page: number,
  Model: mongoose.Model<any>,
): Promise<Array<any>> => {
  const blocks = await Model.find({})
    .skip(numberPerPage * (page - 1))
    .limit(numberPerPage)
    .exec();

  return blocks;
};

export default paginate;

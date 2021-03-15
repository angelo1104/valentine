import mongoose from "mongoose";
import { BlockInterface } from "../libs/block";

const paginate = async (
  numberPerPage: number,
  page: number,
  Model: mongoose.Model<any>,
): Promise<Array<BlockInterface>> => {
  const blocks = await Model.find()
    .skip(numberPerPage * (page - 1))
    .limit(numberPerPage)
    .exec();

  return blocks;
};

export default paginate;

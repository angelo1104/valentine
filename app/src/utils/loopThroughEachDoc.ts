import mongoose from "mongoose";
import { Block } from "../libs/block";
import getBlockFromDoc from "./getBlockFromDoc";

type BlockLoopCallback = (block: Block) => boolean;

async function loopThroughEachDoc(
  Model: mongoose.Model<any>,
  callback: BlockLoopCallback,
) {
  // create a cursor
  const cursor = Model.find().cursor();

  // eslint-disable-next-line no-await-in-loop
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const doBreak = await callback(getBlockFromDoc(doc));

      if (doBreak) break;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export default loopThroughEachDoc;

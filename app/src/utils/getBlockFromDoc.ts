import { Block } from "../libs/block";

function getBlockFromDoc(doc: any): Block {
  const {
    _doc: { _id, __v, ...block },
  } = doc;
  return new Block(block);
}

export default getBlockFromDoc;

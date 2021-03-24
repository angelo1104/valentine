import express from "express";
import paginate from "../../utils/paginate";
import { NUMBER_PER_PAGE_PAGINATION } from "../../constants/constants";
import NodeModel from "../../libs/mongodb/NodeModel";
import BlockChain from "../../libs/block-chain";

const router = express.Router();

router.get("/", async (req, res) => {
  const { page = "1" } = req.query;

  try {
    const getNodes = await paginate(
      NUMBER_PER_PAGE_PAGINATION,
      parseInt(page.toString(), 10),
      NodeModel,
    );
    res.status(200).json({
      nodes: getNodes,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.get("/basic-info", async (req, res) => {
  const blockChain = new BlockChain();

  try {
    const basicInfo = await blockChain.getBasicInfo();
    res.status(200).json({
      ...basicInfo,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

export default router;

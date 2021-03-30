import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Block, BlockService } from '../block/block.service';
import Constants from '../../constants/constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockDocument } from '../../mongodb/block.schema';
import Utils from '../../utils/utils';
import { BlockInterface } from '../../graphql';

@Injectable()
export class BlockChainService {
  constructor(
    @Inject(forwardRef(() => BlockService)) private blockService: BlockService,
    @InjectModel(Constants.chainCollection)
    private BlockModel: Model<BlockDocument>,
  ) {}

  hi = () => this.blockService.block(Constants.genesisBlock);

  private async saveBlockToDB(block: BlockInterface): Promise<BlockDocument> {
    const newBlock = new this.BlockModel({ ...block });
    return await newBlock.save();
  }

  private async addBlock(block: Block, mine = false): Promise<BlockDocument> {
    const lastBlock = await this.lastBlock();

    if (!lastBlock.verifyBlock())
      throw new Error('Last block is not valid. Some problem with the chain.');

    if (block.verifyBlock(lastBlock.blockInformation))
      return await this.saveBlockToDB(block.blockInformation);

    if (!mine) throw new Error('Block is not valid try to mine it.');

    block.mine();

    if (block.verifyBlock(lastBlock.blockInformation))
      return await this.saveBlockToDB(block.blockInformation);

    throw new Error('Block is not valid try to mine it.');
  }

  async createBlock(data: JSON): Promise<BlockDocument> {
    const lastBlock = await this.lastBlock();

    if (!lastBlock)
      throw new Error('No last block at-least create a genesis block');

    const block = this.blockService.block({
      prevHash: lastBlock.hash,
      index: lastBlock.blockInformation.index + 1,
      nonce: 0,
      difficulty: 1,
      data,
      timestamp: Utils.time,
    });

    return await this.addBlock(block, true);
  }

  async lastBlock(): Promise<Block | null> {
    const docs = await this.BlockModel.find({})
      // time increases over time so descending
      .sort({ timestamp: 'descending' })
      .limit(1)
      .exec();

    if (docs.length)
      // it is somehow typescript is not recognizing ._doc
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return this.blockService.block(Utils.getBlockFromDoc(docs[0]));

    return null;
  }
}

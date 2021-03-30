import { Module } from '@nestjs/common';
import { BlockChainController } from './block-chain.controller';
import { BlockChainService } from './block-chain.service';
import { BlockModule } from '../block/block.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockSchema } from '../../mongodb/block.schema';
import Constants from '../../constants/constants';

@Module({
  imports: [
    BlockModule,
    MongooseModule.forFeature([
      {
        name: Constants.chainCollection,
        schema: BlockSchema,
      },
    ]),
  ],
  controllers: [BlockChainController],
  providers: [BlockChainService],
})
export class BlockChainModule {}

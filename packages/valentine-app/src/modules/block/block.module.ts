import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';

@Module({
  imports: [],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}

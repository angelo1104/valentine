import { Controller, Get } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockInterface } from '../../graphql';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Get()
  async blocker(): Promise<BlockInterface> {
    const block = this.blockService.block({
      prevHash: '00',
      index: 1,
      nonce: 20,
      data: 1,
      timestamp: Date.now(),
      difficulty: 1,
    });
    await block.mine();
    return block.blockInformation;
  }
}

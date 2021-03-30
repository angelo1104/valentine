import { Controller, Get } from '@nestjs/common';
import { BlockChainService } from './block-chain.service';
import { BlockInterface } from '../../graphql';

@Controller('chain')
export class BlockChainController {
  constructor(private readonly blockChainService: BlockChainService) {}

  @Get()
  async rome(): Promise<BlockInterface> {
    return await this.blockChainService.createBlock(
      JSON.parse(
        JSON.stringify({
          random: Math.random(),
        }),
      ),
    );
  }
}

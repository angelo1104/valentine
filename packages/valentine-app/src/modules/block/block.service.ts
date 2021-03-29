import { Injectable } from '@nestjs/common';
import { BlockInterface } from '../../graphql';
import Block from './block';

@Injectable()
export class BlockService {
  block(block: BlockInterface) {
    return new Block(block);
  }
}

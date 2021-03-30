import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import GraphQLJSON from 'graphql-type-json';
import { BlockModule } from '../block/block.module';
import { BlockChainModule } from '../block-chain/block-chain.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // define graphql config
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      resolvers: { JSON: GraphQLJSON },
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
    }),
    // import the routing modules
    BlockModule,
    BlockChainModule,
    // mongoose
    MongooseModule.forRoot(
      'mongodb://test:test123@cluster0-shard-00-00.tksqz.mongodb.net:27017,cluster0-shard-00-01.tksqz.mongodb.net:27017,cluster0-shard-00-02.tksqz.mongodb.net:27017/block-chain?ssl=true&replicaSet=atlas-14o6de-shard-0&authSource=admin&retryWrites=true&w=majority',
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

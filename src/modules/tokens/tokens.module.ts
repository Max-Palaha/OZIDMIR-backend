import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService],
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  exports: [TokensService],
})
export class TokensModule {}

import { Injectable } from '@nestjs/common';
import { Token, TokenDocument } from './schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IObjectId } from '@core/mongoose/interfaces';

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

  async saveToken(userId: IObjectId, refreshToken: string) {
    const tokenData = await this.tokenModel.findOne({ user: userId } as FilterQuery<TokenDocument>);
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
    }
    const token = await this.tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await this.tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await this.tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

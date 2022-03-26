import { Injectable } from '@nestjs/common';
import { Token, TokenDocument } from './schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IObjectId } from '@core/mongoose/interfaces';

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

  async saveToken(userId: IObjectId, refreshToken: string): Promise<void> {
    const tokenData: TokenDocument = await this.tokenModel.findOne({ user: userId } as FilterQuery<TokenDocument>);
    if (tokenData) {
      await this.tokenModel.updateOne({ _id: tokenData._id }, { refreshToken });
    } else {
      await this.tokenModel.create({ user: userId, refreshToken });
    }
  }

  async removeToken(refreshToken: string): Promise<void> {
    await this.tokenModel.deleteOne({ refreshToken });
  }

  async findRefreshToken(refreshToken: string): Promise<TokenDocument> {
    return this.tokenModel.findOne({ refreshToken });
  }
}

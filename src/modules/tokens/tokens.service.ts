import { Injectable } from '@nestjs/common';
import { IToken } from '../auth/interfaces';
import { dumpUser } from '../users/dump';
import { UserDocument } from '../users/schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import { Token, TokenDocument } from './schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

  async generateTokens(user: UserDocument): Promise<IToken> {
    const payload = dumpUser(user);
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await this.tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
    }
    const token = await this.tokenModel.create({ user: userId, refreshToken });
    return token;
  }
}

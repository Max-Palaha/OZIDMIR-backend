import { Injectable } from '@nestjs/common';
import { IToken } from '../auth/interfaces';
import { dumpUser } from '../users/dump';
import { UserDocument } from '../users/schemas/user.schema';
//import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt'
import { Token, TokenDocument } from './schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
    ) {}

  async generateTokens(user: UserDocument): Promise<IToken> {
    const payload = dumpUser(user);
    const accessToken = this.jwtService.sign(payload, {secret: process.env.JWT_ACCESS_SECRET ,expiresIn: '30s' });
    const refreshToken = this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' });
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

  async removeToken(refreshToken){
    const tokenData = await this.tokenModel.deleteOne({refreshToken})
    return tokenData;
  }

  async findToken(refreshToken){
    const tokenData = await this.tokenModel.findOne({refreshToken})
    return tokenData;
  }

  validateAccessToken(token: string){
    try{
      const userData = this.jwtService.verify(token, {secret: process.env.JWT_ACCESS_SECRET})
      return userData;
    } catch(e) {
      return null;
    }
  }

  validateRefreshToken(token: string){
    try{
      const userData = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET})
      return userData;
    } catch(e) {
      return null;
    }
  }
}

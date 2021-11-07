import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';

@Module({
  imports: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class s3Module {}

import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SharedIniFileCredentials, S3 } from 'aws-sdk';
import { S3Service } from './s3.service';

@Module({
  imports: [
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: process.env.AWS_REGION,
        credentials: new SharedIniFileCredentials({
          profile: process.env.AWS_PROFILE,
        }),
      },
      services: [S3],
    }),
  ],
  providers: [S3Service],
  exports: [S3Service],
})
export class s3Module {}

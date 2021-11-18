import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ObjectId } from 'mongoose';

@Injectable()
export class S3Service {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  async uploadImage(file: Buffer, folder: string, subfolder: ObjectId) {
    try {
      const fileName = uuid();
      const params = {
        Bucket: `${process.env.AWS_BUCKET}-${process.env.NODE_ENV}`,
        Body: file,
        Key: `${folder}/${subfolder}/${fileName}.jpg`,
      };

      await this.s3.upload(params).promise();

      return fileName;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { IObjectId } from '../mongoose/interfaces';

@Injectable()
export class S3Service {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  async uploadImage(file: Buffer, folder: string, subfolder: IObjectId): Promise<string> {
    try {
      const fileName: string = uuid();
      const params: S3.PutObjectRequest = {
        Bucket: `${process.env.AWS_BUCKET}-${process.env.NODE_ENV}`,
        Body: file,
        Key: `${folder}/${subfolder}/${fileName}.jpg`,
      };

      await this.s3.upload(params).promise();

      return fileName;
    } catch (error: unknown) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

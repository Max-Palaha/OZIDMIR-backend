/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';

const aws_s3_bucket_name = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
@Injectable()
export class ImageUploadService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function (error) {
        return res.status(201).json(req.files[0].location);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: aws_s3_bucket_name,
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);
}

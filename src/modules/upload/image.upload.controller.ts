import { Controller, Post, Req, Res } from '@nestjs/common';
import { ImageUploadService } from './image.upload.service';

@Controller('fileupload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}
  @Post()
  create(@Req() request, @Res() response) {
    return this.imageUploadService.fileupload(request, response);
  }
}

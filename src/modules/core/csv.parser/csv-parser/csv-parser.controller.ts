import { Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { bufferToStream } from './csv-parser.service';

@Controller('csv-parser')
export class CsvParserController {
  csvService: any;
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Res() res) {
    console.log(file);
    const fileStream = bufferToStream(file);
    const resp = await this.csvService.parse(fileStream);
    res.send(resp);
  }
}

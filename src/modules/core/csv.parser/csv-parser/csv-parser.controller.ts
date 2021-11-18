import { Controller, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvParserService } from './csv-parser.service';
import { Express } from 'express';
import * as csv from 'csv-parser';

const results = [];
@Controller('csv-parser')
export class CsvParserController {
  constructor(private csvParserService: CsvParserService) {}
  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res) {
    console.log(file);
    const fileStream = await this.csvParserService.bufferToStream(file.buffer);
    console.log(fileStream);
    fileStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(results);
      });
  }
}

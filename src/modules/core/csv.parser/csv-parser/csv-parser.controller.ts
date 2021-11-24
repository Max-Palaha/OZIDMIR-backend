import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvParserService } from './csv-parser.service';
import { Express } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('csv-parser')
export class CsvParserController {
  constructor(private csvParserService: CsvParserService) {}
  @ApiOperation({ summary: 'parse csv' })
  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.csvParserService.parse(file.buffer);
  }
}

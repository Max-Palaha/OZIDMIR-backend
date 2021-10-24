import { Module } from '@nestjs/common';
import { CsvParserService } from './csv-parser.service';
import { CsvParserController } from './csv-parser.controller';

@Module({
  providers: [CsvParserService],
  controllers: [CsvParserController],
})
export class CsvParserModule {}

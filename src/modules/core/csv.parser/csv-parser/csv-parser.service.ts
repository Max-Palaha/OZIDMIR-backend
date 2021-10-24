import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { CsvParser } from 'nest-csv-parser';
import { Readable } from 'stream';

class Entity {
  foo: string;
  bar: string;
}
@Injectable()
export class CsvParserService {
  constructor(private readonly csvParser: CsvParser) {}

  async parse(stream: any) {
    const str = createReadStream(stream);
    const entities: any = await this.csvParser.parse(str, Entity);
    return entities;
  }
}
export function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class CsvParserService {
  async bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}

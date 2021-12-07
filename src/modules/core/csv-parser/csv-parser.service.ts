import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as csv from 'csv-parser';

@Injectable()
export class CsvParserService {
  private async bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  async parseCountries(buffer) {
    const stream = await this.bufferToStream(buffer);
    const countriesData = await this.handleStream(stream);
    return countriesData;
  }
  private async handleStream(stream) {
    const chunks = [];
    return new Promise((resolve) => {
      const streamEvent = stream.pipe(csv()).on('data', (chunk) => {
        chunks.push(chunk);
      });
      streamEvent.on('end', () => {
        resolve(chunks);
      });
    });
  }
}

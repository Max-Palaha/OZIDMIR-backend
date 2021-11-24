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

  async parse(buffer) {
    const stream = await this.bufferToStream(buffer);
    const res = await this.promiceStream(stream);
    return res;
  }
  async promiceStream(stream) {
    const results = [];
    return new Promise((resolve) => {
      const streamPromice = stream.pipe(csv()).on('data', (data) => {
        results.push(data);
      });
      streamPromice.on('end', () => {
        resolve(results);
      });
    });
  }
}

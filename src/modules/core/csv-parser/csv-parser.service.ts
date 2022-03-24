import { Injectable } from '@nestjs/common';
import internal, { Readable } from 'stream';
import * as csv from 'csv-parser';

@Injectable()
export class CsvParserService {
  public async parseCountries(buffer: Buffer): Promise<Buffer[]> {
    const stream: Readable = this.bufferToStream(buffer);
    return this.handleStream(stream);
  }

  private bufferToStream(buffer: Buffer): Readable {
    const stream: Readable = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  private async handleStream(stream: Readable): Promise<Buffer[]> {
    const chunks: Buffer[] = [];
    return new Promise((resolve) => {
      const streamEvent: internal.Transform = stream.pipe(csv()).on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      streamEvent.on('end', () => {
        resolve(chunks);
      });
    });
  }
}

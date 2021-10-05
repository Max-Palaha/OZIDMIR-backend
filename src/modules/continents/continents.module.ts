import { Module } from '@nestjs/common';
import { ContinentsService } from './continents.service';
import { ContinentsController } from './continents.controller';

@Module({
  providers: [ContinentsService],
  controllers: [ContinentsController],
})
export class ContinentsModule {}

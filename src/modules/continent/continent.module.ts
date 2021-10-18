import { Module } from '@nestjs/common';
import { ContinentService } from './continent.service';
import { ContinentController } from './continent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Continent, ContinentSchema } from './schemas/continent.schema';

@Module({
  providers: [ContinentService],
  controllers: [ContinentController],
  exports: [ContinentService],
  imports: [MongooseModule.forFeature([{ name: Continent.name, schema: ContinentSchema }])],
})
export class ContinentModule {}

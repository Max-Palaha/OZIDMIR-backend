import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContinentModule } from '../continent/continent.module';
import { LoggerModule } from '../core/logger/logger.module';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { Country, CountrySchema } from './schemas/country.schema';

@Module({
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService],
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
    LoggerModule.forRoot(),
    ContinentModule,
  ],
})
export class CountryModule {}

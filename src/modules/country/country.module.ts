import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './schemas/country.schema';
import { LoggerModule } from '../core/logger/logger.module';

@Module({
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService],
  imports: [MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]), LoggerModule.forRoot()],
})
export class CountryModule {}

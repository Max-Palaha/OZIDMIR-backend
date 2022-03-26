import { MongooseModuleOptions } from '@nestjs/mongoose';

export const MONGO_OPTIONS: MongooseModuleOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

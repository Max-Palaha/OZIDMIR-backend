import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_NAME}?retryWrites=true&w=majority`,
}));

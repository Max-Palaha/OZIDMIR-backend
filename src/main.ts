import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from './utils/validation.pipe';
import * as cookieParser from 'cookie-parser';
import { SocketAdapter } from './helpers/socket.adapter';

async function bootstrap() {
  const whitelist = ['https://127.0.0.1:4200', 'http://localhost:4200', undefined];
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useWebSocketAdapter(new SocketAdapter(app));
  app.use(cookieParser());
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Country info')
    .setDescription('information about all countries')
    .setVersion('1.0')
    .addTag('country')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => Logger.log(`Server has run on ${PORT} port`));
}
bootstrap();

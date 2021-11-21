import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from './utils/validation.pipe';
import * as cookieParser from 'cookie-parser';
import { SocketAdapter } from './helpers/socket.adapter';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useWebSocketAdapter(new SocketAdapter(app));
  app.use(cookieParser());
  app.enableCors({ origin: true });
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

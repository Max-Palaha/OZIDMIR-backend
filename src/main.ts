import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from './utils/validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  const config = new DocumentBuilder()
    .setTitle('Country info')
    .setDescription('information about all countries')
    .setVersion('1.0')
    .addTag('country')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.use(cookieParser());
  app.enableCors({ origin: true })
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  

  await app.listen(PORT, () => Logger.log(`Server has run on ${PORT} port`));
}
bootstrap();

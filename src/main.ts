// swagger/swagger.ts

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module'; // Update the import path
import * as dotenv from 'dotenv';
import * as cookieParser from "cookie-parser";

dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
//   app.enableCors({
//     origin: 'http://localhost:8080',
//     credentials: true
// })
  const config = new DocumentBuilder()
    .setTitle('NestJS Swagger Example')
    .setDescription('API Documentation for NestJS Swagger Example')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  await app.listen(3000);
}
bootstrap();

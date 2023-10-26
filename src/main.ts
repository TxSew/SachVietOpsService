// swagger/swagger.ts

import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module"; // Update the import path
import * as dotenv from "dotenv";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle("NestJS Swagger Example")
    .setDescription("API Documentation for NestJS Swagger Example")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("", app, document);
  await app.listen(process.env.PORT|| 8003);
}
bootstrap();

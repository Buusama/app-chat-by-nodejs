import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { setupS3Configs } from './config/aws.config';
import { setupApiDocument } from './config/swagger.config';
import { CustomIoAdapter } from './modules/websocket/adapters';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          [error.property]: error.constraints,
        }));
        return new BadRequestException(result);
      },
    }),
  );
  setupApiDocument(app);
  // setupS3Configs(); // uncomment this line if you want to use AWS S3
  app.enableCors();
  app.useWebSocketAdapter(new CustomIoAdapter(app));
  await app.listen(3000);
}
bootstrap();

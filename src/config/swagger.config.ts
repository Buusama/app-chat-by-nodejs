import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupApiDocument = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('NestJS API Documentations')
    .setDescription('The API documentations for NestJs base app')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Please enter token in following format: Bearer <JWT>',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .addTag('NestJS')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-documents', app, document);
};

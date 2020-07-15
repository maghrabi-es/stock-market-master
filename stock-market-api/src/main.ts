import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  const port = process.env.PORT || 3333;
  await app.listen(port).then(() => {
    console.log('Running on port: ' + port);
  });
}
bootstrap();

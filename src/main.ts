import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { jwtConstants } from './auth/constants';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: jwtConstants.clientUrl, credentials: true },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(cookieParser());

  app.use(helmet());
  
  await app.listen(5001);
}
bootstrap();

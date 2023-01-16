import dotenv from 'dotenv';
dotenv.config();
import { App } from './app.js';

function bootstrap() {
  const PORT =
    process.env.PORT && !Number.isNaN(process.env.PORT)
      ? +process.env.PORT
      : 4000;

  const isMulti = false;

  if (isMulti) {
  } else {
    const app = new App(PORT);
    app.listen();
  }
}

bootstrap();

import dotenv from 'dotenv';
dotenv.config();
import { App } from './app.js';
import { parseArgs } from './core/utils/args.js';
import { createBalancer } from './createBalancer.js';

function bootstrap() {
  const PORT =
    process.env.PORT && !Number.isNaN(process.env.PORT)
      ? +process.env.PORT
      : 4000;

  const args = parseArgs();
  const isMulti = !!args['isMulti'];

  if (isMulti) {
    createBalancer(PORT);
  } else {
    const app = new App(PORT);
    app.listen(`App listening on the port ${app.port}`);
  }
}

bootstrap();

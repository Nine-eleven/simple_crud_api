import os from 'os';
import cluster from 'cluster';
import { App } from './app.js';
import { usersRepository } from './controllers/users/users.repository.js';

export const createBalancer = (port: number) => {
  const numCPUs = os.cpus().length;

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running, wait for workers...`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({ WORKER_PORT: port + 1 + i });
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });

    cluster.on('message', async (worker, message) => {
      if (message.cmd in usersRepository) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const data = await usersRepository[message.cmd](...message.data);
        worker.send({ cmd: message.cmd, data });
      }
    });
  } else {
    const PORT =
      process.env.WORKER_PORT && !Number.isNaN(process.env.WORKER_PORT)
        ? +process.env.WORKER_PORT
        : 4000;

    const app = new App(PORT);
    app.listen(
      `Worker ${process.pid} server running at http://localhost:${app.port}/`,
    );

    process.on('message', (message) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      usersRepository.emit(message['cmd'], message);
    });
  }
};

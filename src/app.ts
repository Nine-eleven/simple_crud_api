import {
  createServer,
  IncomingMessage,
  Server as HttpServer,
  ServerResponse,
} from 'http';
import { userController } from './controllers/users/users.controller.js';
import { getRequestData } from './core/utils/getRequestData.js';
import {
  BASE_URL_PATH,
  CONTROLLER,
  HTTP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_STATUS_CODE,
} from './core/constants/index.js';

class App {
  private readonly port: number;
  private server: HttpServer;

  constructor(port: number) {
    this.port = port;
    this.server = createServer();

    this.initializeControllers();
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeControllers() {
    this.server.addListener(
      'request',
      async (req: IncomingMessage, res: ServerResponse) => {
        if (!req.url || !req.method) return;

        res.setHeader('Content-Type', 'application/json');

        const body = await getRequestData(req);
        const parts = req.url.split('/');
        const [basePath, controllerPath, param, ...restParts] = parts;

        if (
          basePath !== BASE_URL_PATH ||
          !Object.values(CONTROLLER).some(
            (controller) => controller === controllerPath,
          ) ||
          !!restParts.length
        ) {
          let result;
          let statusCode = 200;

          if (controllerPath === CONTROLLER.USERS) {
            const responseData = await userController.handleRequestMethod(
              req.method,
              param,
              body,
            );
            if (!responseData) return;

            result = responseData?.result || undefined;
            statusCode = responseData.statusCode;
          } else {
            return;
          }

          res.writeHead(statusCode);
          res.end(result ? JSON.stringify(result) : '');
        } else {
          res.writeHead(HTTP_RESPONSE_STATUS_CODE.NOT_FOUND);
          res.end(
            JSON.stringify({
              code: HTTP_RESPONSE_STATUS_CODE.NOT_FOUND,
              message: HTTP_RESPONSE_MESSAGE.RESOURCE_NOT_FOUND,
            }),
          );
        }
      },
    );
  }
}

export { App };

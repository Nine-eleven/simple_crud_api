import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../../controllers/users/user.entity.js';

export interface Controller {
  handleRequestMethod: (
    requestMethod: string,
    param: string,
    body: string,
  ) => Promise<
    | {
        statusCode: number;
        result: { code: number; message: any } | undefined | User | User[];
      }
    | undefined
  >;
}

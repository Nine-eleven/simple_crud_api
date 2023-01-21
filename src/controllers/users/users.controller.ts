import { Controller } from '../../core/interfaces/controller.interface.js';
import {
  HTTP_METHOD,
  HTTP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_STATUS_CODE,
} from '../../core/constants/index.js';
import { NotFoundError, ValidationError } from '../../core/errors.js';
import { validateUserId } from '../../core/utils/validateUserId.js';
import { userService } from './users.service.js';
import { mapUser } from '../../core/utils/mapUser.js';

class UsersController implements Controller {
  async handleRequestMethod(
    requestMethod: string,
    userId: string,
    body: string,
  ) {
    try {
      switch (requestMethod) {
        case HTTP_METHOD.GET:
          return await this.get(userId);
        case HTTP_METHOD.POST:
          if (userId) {
            throw new NotFoundError(HTTP_RESPONSE_MESSAGE.RESOURCE_NOT_FOUND);
          }
          return await this.post(body);
        case HTTP_METHOD.PUT:
          return await this.put(userId, body);
        case HTTP_METHOD.DELETE:
          return await this.delete(userId);
      }
    } catch (error: any) {
      let statusCode;

      if (error instanceof ValidationError) {
        statusCode = HTTP_RESPONSE_STATUS_CODE.BAD_REQUEST;
      } else if (error instanceof NotFoundError) {
        statusCode = HTTP_RESPONSE_STATUS_CODE.NOT_FOUND;
      } else if (error instanceof Error) {
        statusCode = HTTP_RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR;
      } else {
        return;
      }
      const result = { code: statusCode, message: error.message };
      return { result, statusCode };
    }
  }

  async get(userId: string) {
    let result;
    if (userId) {
      validateUserId(userId);
      result = await userService.findOne(userId);
    } else {
      result = await userService.findAll();
    }

    return { statusCode: HTTP_RESPONSE_STATUS_CODE.OK, result };
  }

  async post(body: string) {
    const createUserDTO = mapUser(body);
    const result = await userService.create(createUserDTO);
    return { statusCode: HTTP_RESPONSE_STATUS_CODE.CREATED, result };
  }

  async put(userId: string, body: string) {
    validateUserId(userId);
    const updateUserDto = mapUser(body);
    const result = await userService.update(userId, updateUserDto);
    return { statusCode: HTTP_RESPONSE_STATUS_CODE.OK, result };
  }

  async delete(userId: string) {
    validateUserId(userId);
    await userService.remove(userId);
    return {
      statusCode: HTTP_RESPONSE_STATUS_CODE.NO_CONTENT,
      result: undefined,
    };
  }
}

const userController = new UsersController();
export { userController };

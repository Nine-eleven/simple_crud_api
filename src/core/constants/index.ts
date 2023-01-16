export const BASE_URL_PATH = 'api';

export enum HTTP_RESPONSE_STATUS_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum HTTP_RESPONSE_MESSAGE {
  RESOURCE_NOT_FOUND = 'Resource not found',
  USER_ID_IS_INVALID = 'User id is invalid',
  USER_NOT_FOUND = 'User not found',
  UNEXPECTED_ERROR = 'Unexpected error',
  INVALID_REQUEST_BODY_FORMAT = 'Invalid request body format',
  REQUEST_BODY_DOESNT_CONTAIN_REQUIRED_FIELD = 'Request body does not contain required fields',
}

export enum CONTROLLER {
  USERS = 'users',
}

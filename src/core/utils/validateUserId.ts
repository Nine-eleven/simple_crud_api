import * as uuid from 'uuid';
import { ValidationError } from '../errors.js';
import { HTTP_RESPONSE_MESSAGE } from '../constants/index.js';

export const validateUserId = (userId: any) => {
  if (!uuid.validate(userId)) {
    throw new ValidationError(HTTP_RESPONSE_MESSAGE.USER_ID_IS_INVALID);
  }
};

import { ValidationError } from '../errors.js';
import { HTTP_RESPONSE_MESSAGE } from '../constants/index.js';
import { CreateUpdateUserDto } from '../../controllers/users/dto/create-user.dto.js';

export const mapUser = (body: string): CreateUpdateUserDto => {
  try {
    const parsedBody: CreateUpdateUserDto = JSON.parse(body);

    if (
      typeof parsedBody.username !== 'string' ||
      typeof parsedBody.age !== 'number' ||
      !Array.isArray(parsedBody.hobbies) ||
      parsedBody.hobbies.some((item) => typeof item !== 'string')
    ) {
      throw new ValidationError(
        HTTP_RESPONSE_MESSAGE.REQUEST_BODY_DOESNT_CONTAIN_REQUIRED_FIELD,
      );
    } else {
      return {
        username: parsedBody.username,
        age: parsedBody.age,
        hobbies: parsedBody.hobbies,
      };
    }
  } catch (error) {
    throw new ValidationError(
      HTTP_RESPONSE_MESSAGE.INVALID_REQUEST_BODY_FORMAT,
    );
  }
};

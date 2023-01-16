import { User } from './user.entity.js';
import { NotFoundError } from '../../core/errors.js';
import { UsersRepository } from './users.repository.js';
import { HTTP_RESPONSE_MESSAGE } from '../../core/constants/index.js';
import { CreateUpdateUserDto } from './dto/create-user.dto.js';

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundError(HTTP_RESPONSE_MESSAGE.USER_NOT_FOUND);
    }

    return user;
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async create(input: CreateUpdateUserDto) {
    return this.usersRepository.create(input);
  }

  async update(id: string, input: CreateUpdateUserDto) {
    await this.findOne(id);
    const result = this.usersRepository.update(id, input);
    return result;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.usersRepository.remove(id);
  }
}

const userService = new UsersService(new UsersRepository());

export { userService };

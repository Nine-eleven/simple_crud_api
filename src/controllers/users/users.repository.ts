import * as uuid from 'uuid';
import cluster from 'cluster';
import { EventEmitter } from 'events';
import { User } from './user.entity.js';
import { HTTP_RESPONSE_MESSAGE } from '../../core/constants/index.js';
import { CreateUpdateUserDto } from './dto/create-user.dto.js';
import { NotFoundError } from '../../core/errors.js';

export class UsersRepository extends EventEmitter {
  private readonly users: User[] = [];

  private async requestMasterForData(obj: any): Promise<any> {
    return new Promise((resolve) => {
      process.send!(obj, () => {
        this.once(obj.cmd, (msg) => {
          resolve(msg['data']);
        });
      });
    });
  }

  async find(): Promise<User[]> {
    if (cluster.isWorker) {
      const obj = { cmd: 'find', data: [] };
      return await this.requestMasterForData(obj);
    } else {
      return this.users;
    }
  }

  async findOne(id: string): Promise<User> {
    if (cluster.isWorker) {
      const obj = { cmd: 'findOne', data: [id] };
      return await this.requestMasterForData(obj);
    } else {
      return this.users.filter((item) => item.id === id)[0];
    }
  }

  async create(input: CreateUpdateUserDto): Promise<User> {
    if (cluster.isWorker) {
      const obj = { cmd: 'create', data: [input] };
      const result = await this.requestMasterForData(obj);
      return result;
    } else {
      const user = new User({
        id: uuid.v4(),
        username: input.username,
        age: input.age,
        hobbies: input.hobbies,
      });
      this.users.push(user);
      return user;
    }
  }

  async update(id: string, input: CreateUpdateUserDto): Promise<User> {
    if (cluster.isWorker) {
      const obj = { cmd: 'update', data: [id, input] };
      return await this.requestMasterForData(obj);
    } else {
      const user = Object.assign(await this.findOne(id), input);
      return user;
    }
  }

  async remove(id: string) {
    if (cluster.isWorker) {
      const obj = { cmd: 'remove', data: [id] };
      return await this.requestMasterForData(obj);
    } else {
      const index = this.users.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.users.splice(index, 1);
      } else {
        throw new NotFoundError(HTTP_RESPONSE_MESSAGE.USER_NOT_FOUND);
      }
    }
  }
}

const usersRepository = new UsersRepository();
export { usersRepository };

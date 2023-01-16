export class User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];

  constructor(data: {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
  }) {
    this.id = data.id;
    this.username = data.username;
    this.age = data.age;
    this.hobbies = data.hobbies;
  }
}

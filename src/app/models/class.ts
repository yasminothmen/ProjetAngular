import {User} from "./user";

export class Class {

id: string;
name:string;
level:string;
studentsCount: number;
students: User[];

  constructor() {
    this.id = '';
    this.name = '';
    this.level = '';
    this.studentsCount = 0;
    this.students = [];
  }
}

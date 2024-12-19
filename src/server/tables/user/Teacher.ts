import { User } from "./User";
import { Role } from "./Role";

import DatabaseSingleton from "$server";

export class Teacher extends User {
    constructor() {
        super();
    }

    public static getAll(): Teacher[] {
        const teachers = super.getAll("Teacher");
        return teachers.map(teacher => Object.assign(new Teacher(), teacher));
    }

}
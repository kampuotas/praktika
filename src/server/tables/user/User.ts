import type { Database } from "better-sqlite3";
import type { Role } from "./Role";
import bcrypt from 'bcrypt';

import DatabaseSingleton from "$server";

import type { DatabaseRecord } from "$server/tables/DatabaseRecords";

export class User implements DatabaseRecord {

    protected _id!: number;
    protected _username!: string;
    protected _password?: string;
    protected _role!: Role;
    protected _name?: string;
    protected _surname?: string;

    private db: Database;
    
    constructor(){
        this.db = DatabaseSingleton.getInstance();
    }

    static async login(username: string, password: string): Promise<boolean | User>{
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM users WHERE username = $username`;

        const stmnt = db.prepare(sql);
        const row: any = stmnt.get({ username }) as { password: string };

        if (!row) {
            return false;
        } 

        if(await bcrypt.compare(password, row.password)){
            const user = new User();
            user._id = row.id;
            user._username = row.username;
            user._password = row.password;
            user._role = row.role;
            user._name = row.name;
            user._surname = row.surname;

            return user;
        }

        return false;
    }

    public static create(username: string, password: string, role: Role | string, name: string, surname: string): User {
        const db: Database = DatabaseSingleton.getInstance();

        //Validation 

        const salt = bcrypt.genSaltSync(12);
		const hashed_password = bcrypt.hashSync(password, salt);
        const sql = `INSERT INTO users (username, password, role, name, surname) VALUES (?, ?, ?, ?, ?)`;
        const result = db.prepare(sql).run(username, hashed_password, role, name, surname);

        const newUser = new User();
        newUser._id = result.lastInsertRowid as number;
        newUser._username = username;
        newUser._password = hashed_password;
        newUser._role = role as Role;
        newUser._name = name;
        newUser._surname = surname;

        // console.log(newUser);

        return newUser;
    }

    public static findById(id: number): User | null {
        const db: Database = DatabaseSingleton.getInstance();

        const sql = `SELECT * FROM users WHERE id = ?`;
        const row: any = db.prepare(sql).get(id);

        if(!row){
            return null;
        }

        const user = new User();
        user._id = row.id;
        user._username = row.username;
        user._password = row.password;
        user._role = row.role;
        user._name = row.name;
        user._surname = row.surname;

        return user;
    }

    public static findByUsername(username: string): User | null {
        const db: Database = DatabaseSingleton.getInstance();

        const sql = `SELECT * FROM users WHERE username = ?`;
        const row: any = db.prepare(sql).get(username);

        if(!row){
            return null;
        }

        const user = new User();
        user._id = row.id;
        user._username = row.username;
        user._password = row.password;
        user._role = row.role;
        user._name = row.name;
        user._surname = row.surname;

        return user;
    }   

    public static getAll(role?: string): User[] {
        const db: Database = DatabaseSingleton.getInstance();

        const sql = role
            ? `SELECT * FROM users WHERE role = ?`
            : `SELECT * FROM users`;
        const rows: any[] = role ? db.prepare(sql).all(role) : db.prepare(sql).all();

        return rows.map(row => {
            const user = new User();
            user._id = row.id;
            user._username = row.username;
            user._password = row.password;
            user._role = row.role;
            user._name = row.name;
            user._surname = row.surname;

            return user;
        });
    }

    public toJSON() {
        return {
            id: this._id,
            username: this._username,
            role: this._role,
            name: this._name,
            surname: this._surname,
            fullname: this.getFullName()
        };
    }
    
    public update(): void {
        let updatePassword = false;
        if (this._password && this._password.trim() !== '') {
            const salt = bcrypt.genSaltSync(12);
            this._password = bcrypt.hashSync(this._password, salt);
            updatePassword = true;
        }
    
        const sql = updatePassword
            ? `UPDATE users SET username = ?, password = ?, role = ?, name = ?, surname = ? WHERE id = ?`
            : `UPDATE users SET username = ?, role = ?, name = ?, surname = ? WHERE id = ?`;
    
        const params = updatePassword
            ? [this._username, this._password, this._role, this._name, this._surname, this.id]
            : [this._username, this._role, this._name, this._surname, this.id];
        
        this.db.prepare(sql).run(...params);
    }  

    public delete(): void {
        const sql = 'DELETE FROM users WHERE id = ?';
        this.db.prepare(sql).run(this.id);
    }

    //GETTERS AND SETTERS
    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get username(): string {
        return this._username;
    }
    
    public set username(value: string) {
        if (!value || value.trim().length === 0) {
          throw new Error("Username cannot be empty.");
        }
        this._username = value;
    }

    public get password(): string | undefined {
        return this._password;
    }
    
    public set password(value: string | undefined) {
        if (value && value.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        this._password = value;
    }    
    
    public get role(): Role {
        return this._role;
    }
    
    public set role(value: Role) {
        this._role = value;
    }

    public get name(): string | undefined {
        return this._name;
    }
    
    public set name(value: string | undefined) {
        this._name = value;
    }    

    public get surname(): string | undefined {
        return this._surname;
    }
    
    public set surname(value: string | undefined) {
        this._surname = value;
    }   
    
    public getFullName(): string {
        return `${this._name || ""} ${this._surname || ""}`.trim();
    }    
}
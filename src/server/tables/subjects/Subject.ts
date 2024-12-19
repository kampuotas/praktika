import type { Database } from "better-sqlite3";
import DatabaseSingleton from "$server";

import type { DatabaseRecord } from "$server/tables/DatabaseRecords";
import type { Teacher } from "../user/Teacher";

export class Subject implements DatabaseRecord {
    protected _id!: number;
    protected _name!: string;

    private db: Database;

    constructor(){
        this.db = DatabaseSingleton.getInstance();
    }

    public static create(name: string): Subject {
        const db: Database = DatabaseSingleton.getInstance();

        const sql = `INSERT INTO subjects (name) VALUES (?)`;
        const result = db.prepare(sql).run(name);

        const newSubject = new Subject();
        newSubject._id = result.lastInsertRowid as number;
        newSubject._name = name;

        return newSubject;
    }

    public toJSON() {
        return {
            id: this._id,
            name: this._name
        }
    }

    public update(): void {
        const sql = `UPDATE subjects SET name = ? WHERE id = ?`;

        this.db.prepare(sql).run(this._name, this._id);
    }

    public delete(): void {
        const deleteAssignmentsSql = `DELETE FROM subject_teachers WHERE subject_id = ?`;
        this.db.prepare(deleteAssignmentsSql).run(this._id);
    
        const deleteSubjectSql = `DELETE FROM subjects WHERE id = ?`;
        this.db.prepare(deleteSubjectSql).run(this._id);
    }

    public static findById(id: number): Subject {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subjects WHERE id = ?`;

        const stmnt = db.prepare(sql);
        const row: any = stmnt.get(id);

        if (!row) {
            throw new Error(`No subject with id ${id}`);
        } 

        const subject = new Subject();
        subject._id = row.id;
        subject._name = row.name;

        return subject;
    }

    public static findByName(name: string): Subject | null {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subjects WHERE name = ?`;

        const stmnt = db.prepare(sql);
        const row: any = stmnt.get(name);

        if(!row){
            return null;
        }

        const subject = new Subject();
        subject._id = row.id;
        subject._name = row.name;

        return subject;
    }

    public static getAll(): Subject[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subjects`;

        const stmnt = db.prepare(sql);
        const rows: any[] = stmnt.all();

        return rows.map(row => {
            const subject = new Subject();
            subject._id = row.id;
            subject._name = row.name;

            return subject;
        });
    }

    public static getSubjectWithTeachers(subjectId: number): { subject: Subject, teachers: Teacher[] } {
        const db: Database = DatabaseSingleton.getInstance();
    
        const sql = `
            SELECT 
                s.id as subject_id, 
                s.name as subject_name, 
                t.id as teacher_id, 
                t.username as teacher_username, 
                t.name as teacher_name,
                t.surname as teacher_surname
            FROM subjects s
            LEFT JOIN subject_teachers st ON s.id = st.subject_id
            LEFT JOIN users t ON st.teacher_id = t.id
            WHERE s.id = ?`;
    
        const rows: any = db.prepare(sql).all(subjectId);
    
        if (rows.length === 0) {
            throw new Error(`No subject found with id ${subjectId}`);
        }
    
        const subject = new Subject();
        subject._id = rows[0].subject_id;
        subject._name = rows[0].subject_name;
        
        //@ts-ignore
        const teachers: Teacher[] = rows.filter(row => row.teacher_id) .map(row => ({
                id: row.teacher_id,
                username: row.teacher_username,
                name: row.teacher_name,
                surname: row.teacher_surname,
                fullname: `${row.teacher_name} ${row.teacher_surname}`
            }));
    
        return { subject, teachers };
    }
    

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }    
}
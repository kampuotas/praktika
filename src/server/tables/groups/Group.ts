import type { Database } from "better-sqlite3";
import DatabaseSingleton from "$server";

import type { DatabaseRecord } from "$server/tables/DatabaseRecords";
import { Student } from "../user/Student";
import { Subject } from "../subjects/Subject";
import type { Teacher } from "../user/Teacher";

export class Group implements DatabaseRecord {
    protected _id!: number;
    protected _name!: string;
    protected _description!: string;

    private db: Database;

    constructor(){
        this.db = DatabaseSingleton.getInstance();
    }

    public static create(name: string, description: string): Group {
        const db: Database = DatabaseSingleton.getInstance();

        const sql = `INSERT INTO groups (name, description) VALUES (?,?)`;
        const result = db.prepare(sql).run(name, description);

        const newSubject = new Group();
        newSubject._id = result.lastInsertRowid as number;
        newSubject._name = name;
        newSubject._description = description;

        return newSubject;
    }

    public toJSON() {
        return {
            id: this._id,
            name: this._name,
            description: this._description
        }
    }

    public update(): void {
        const sql = `UPDATE groups SET name = ?, description = ? WHERE id = ?`;

        this.db.prepare(sql).run(this._name, this._description, this._id);
    }

    public delete(): void {
        const deleteGroupStudentAssignmentsSql = `DELETE FROM group_students WHERE group_id = ?`;
        this.db.prepare(deleteGroupStudentAssignmentsSql).run(this._id);
    
        const deleteSubjectGroupAssignmentsSql = `DELETE FROM subject_groups WHERE group_id = ?`;
        this.db.prepare(deleteSubjectGroupAssignmentsSql).run(this._id);

        const deleteGroupSql = `DELETE FROM groups WHERE id = ?`;
        this.db.prepare(deleteGroupSql).run(this._id);
    }

    public static findById(id: number): Group {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM groups WHERE id = ?`;

        const stmnt = db.prepare(sql);
        const row: any = stmnt.get(id); 
 
        if (!row) {
            throw new Error(`No group with id ${id}`);
        } 

        const group = new Group();
        group._id = row.id;
        group._name = row.name;
        group._description = row.description

        return group;
    }

    public static findByName(name: string): Group | null {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM groups WHERE name = ?`;

        const stmnt = db.prepare(sql);
        const row: any = stmnt.get(name);

        if(!row){
            return null;
        }

        const group = new Group();
        group._id = row.id;
        group._name = row.name;
        group._description = row.description;

        return group;
    }

    public static getAll(): Group[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM groups`;

        const stmnt = db.prepare(sql);
        const rows: any[] = stmnt.all();

        return rows.map(row => {
            const group = new Group();
            group._id = row.id;
            group._name = row.name;
            group._description = row.description;

            return group;
        });
    }

    public static getAllByTeacher(teacher: Teacher): Group[] {
        const db: Database = DatabaseSingleton.getInstance();
    
        const sql = `
            SELECT DISTINCT g.id, g.name, g.description
            FROM groups g
            INNER JOIN subject_groups sg ON g.id = sg.group_id
            INNER JOIN subject_teachers st ON sg.subject_id = st.subject_id
            WHERE st.teacher_id = ?`;
    
        const rows: any[] = db.prepare(sql).all(teacher.id);
        console.log(rows);
    
        return rows.map(row => {
            const group = new Group();
            group._id = row.id;
            group._name = row.name;
            group._description = row.description;
    
            return group;
        });
    }    

    public static getGroupWithStudents(groupId: number): { group: Group, students: Student[] } {
        const db: Database = DatabaseSingleton.getInstance();
    
        const sql = `
            SELECT 
                g.id as group_id,
                g.name as group_name,
                g.description as group_description,
                u.id as student_id,
                u.username as student_username,
                u.name as student_name,
                u.surname as student_surname
            FROM groups g
            LEFT JOIN group_students gs ON g.id = gs.group_id
            LEFT JOIN users u ON gs.student_id = u.id
            WHERE g.id = ?`;
    
        const rows: any[] = db.prepare(sql).all(groupId);
    
        if (rows.length === 0) {
            throw new Error(`No group found with id ${groupId}`);
        }
    
        const group = new Group();
        group._id = rows[0].group_id;
        group._name = rows[0].group_name;
        group._description = rows[0].group_description;
    
        //@ts-ignore
        const students: Student[] = rows
            .filter(row => row.student_id)
            .map(row => ({
                id: row.student_id,
                username: row.student_username,
                name: row.student_name,
                surname: row.student_surname,
                fullname: `${row.student_name} ${row.student_surname}`,
            }));
    
        return { group, students };
    }

    public static getGroupSubject(groupId: number): { group: Group, subject: Subject } {
        const db: Database = DatabaseSingleton.getInstance();
    
        const sql = `
            SELECT 
                g.id as group_id,
                g.name as group_name,
                g.description as group_description,
                s.id as subject_id,
                s.name as subject_name
            FROM groups g
            LEFT JOIN subject_groups gs ON g.id = gs.group_id
            LEFT JOIN subjects s ON gs.subject_id = s.id
            WHERE g.id = ?`;
    
        const rows: any[] = db.prepare(sql).all(groupId);
    
        if (rows.length === 0) {
            throw new Error(`No group found with id ${groupId}`);
        }
    
        const group = new Group();
        group._id = rows[0].group_id;
        group._name = rows[0].group_name;
        group._description = rows[0].group_description;
    
        const subject = new Subject();
        subject.id = rows[0].subject_id;
        subject.name = rows[0].subject_name;
    
        return { group, subject };
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }    

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
    }
}
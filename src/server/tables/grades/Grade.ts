import type { Database } from "better-sqlite3";
import DatabaseSingleton from "$server";
import type { DatabaseRecord } from "$server/tables/DatabaseRecords";

export class Grade implements DatabaseRecord {
    protected _id!: number;
    protected _datetime!: number;
    protected _student_id!: number;
    protected _group_id!: number;
    protected _grade!: number;

    private db: Database;

    constructor() {
        this.db = DatabaseSingleton.getInstance();
    }

    public static grade(datetime: number, studentId: number, groupId: number, grade: number): Grade {
        const db: Database = DatabaseSingleton.getInstance();

        const sql = `
            INSERT INTO grades (datetime, student_id, group_id, grade) 
            VALUES (?,?,?,?)
        `;
        const result = db.prepare(sql).run(datetime, studentId, groupId, grade);

        const newGrade = new Grade();
        newGrade._id = result.lastInsertRowid as number;
        const row: any = db.prepare(`SELECT * FROM grades WHERE id = ?`).get(newGrade._id);
        if (!row) {
            throw new Error("Failed to create grade record.");
        }

        newGrade._datetime = row.datetime;
        newGrade._student_id = row.student_id;
        newGrade._group_id = row.group_id;
        newGrade._grade = row.grade;

        return newGrade;
    }

    public static findById(id: number): Grade {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM grades WHERE id = ?`;
        const row: any = db.prepare(sql).get(id);

        if (!row) {
            throw new Error(`No grade with id ${id}`);
        }

        const grade = new Grade();
        grade._id = row.id;
        grade._datetime = row.datetime;
        grade._student_id = row.student_id;
        grade._group_id = row.group_id;
        grade._grade = row.grade;

        return grade;
    }

    public static getGradesByGroup(groupId: number): Grade[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM grades WHERE group_id = ?`;
        const rows: any[] = db.prepare(sql).all(groupId);

        return rows.map(row => {
            const grade = new Grade();
            grade._id = row.id;
            grade._datetime = row.datetime;
            grade._student_id = row.student_id;
            grade._group_id = row.group_id;
            grade._grade = row.grade;
            return grade;
        });
    }

    public static getGradesByGroupAndStudent(groupId: number, studentId: number): Grade[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM grades WHERE group_id = ? AND student_id = ?`;
        const rows: any[] = db.prepare(sql).all(groupId, studentId);

        return rows.map(row => {
            const grade = new Grade();
            grade._id = row.id;
            grade._datetime = row.datetime;
            grade._student_id = row.student_id;
            grade._group_id = row.group_id;
            grade._grade = row.grade;
            return grade;
        });
    }

    public static getAll(): Grade[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM grades`;
        const rows: any[] = db.prepare(sql).all();

        return rows.map(row => {
            const grade = new Grade();
            grade._id = row.id;
            grade._datetime = row.datetime;
            grade._student_id = row.student_id;
            grade._group_id = row.group_id;
            grade._grade = row.grade;
            return grade;
        });
    }

    public static getAllByStudent(studentId: number): Grade[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM grades WHERE student_id = ?`;
        const rows: any[] = db.prepare(sql).all(studentId);

        return rows.map(row => {
            const grade = new Grade();
            grade._id = row.id;
            grade._datetime = row.datetime;
            grade._student_id = row.student_id;
            grade._group_id = row.group_id;
            grade._grade = row.grade;
            return grade;
        });
    }

    public static getAllByGroup(groupId: number): Grade[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM grades WHERE group_id = ?`;
        const rows: any[] = db.prepare(sql).all(groupId);

        return rows.map(row => {
            const grade = new Grade();
            grade._id = row.id;
            grade._datetime = row.datetime;
            grade._student_id = row.student_id;
            grade._group_id = row.group_id;
            grade._grade = row.grade;
            return grade;
        });
    }

    public update(): void {
        const sql = `
            UPDATE grades 
            SET datetime = ?, student_id = ?, group_id = ?, grade = ? 
            WHERE id = ?
        `;
        this.db.prepare(sql).run(this._datetime, this._student_id, this._group_id, this._grade, this._id);
    }

    public delete(): void {
        const sql = `DELETE FROM grades WHERE id = ?`;
        this.db.prepare(sql).run(this._id);
    }

    public toJSON() {
        return {
            id: this._id,
            datetime: this._datetime,
            student_id: this._student_id,
            group_id: this._group_id,
            grade: this._grade
        }
    }

    public get id(): number {
        return this._id;
    }

    public get datetime(): number {
        return this._datetime;
    }

    public set datetime(value: number) {
        this._datetime = value;
    }

    public get studentId(): number {
        return this._student_id;
    }

    public set studentId(value: number) {
        this._student_id = value;
    }

    public get groupId(): number {
        return this._group_id;
    }

    public set groupId(value: number) {
        this._group_id = value;
    }

    public get grade(): number {
        return this._grade;
    }

    public set grade(value: number) {
        this._grade = value;
    }
}

import type { Database } from "better-sqlite3";
import DatabaseSingleton from "$server";

import type { DatabaseRecord } from "$server/tables/DatabaseRecords";

export class SubjectTeacher implements DatabaseRecord{
    protected _id!: number;
    protected _subjectId!: number;
    protected _teacherId!: number;

    private db: Database;

    constructor() {
        this.db = DatabaseSingleton.getInstance();
    }

    public static assign(subjectId: number, teacherId: number): SubjectTeacher {
        const db: Database = DatabaseSingleton.getInstance();
    
        const existsSql = `SELECT * FROM subject_teachers WHERE subject_id = ? AND teacher_id = ?`;
        const existingRow: any = db.prepare(existsSql).get(subjectId, teacherId);
    
        if (existingRow) {
            const existingSubjectTeacher = new SubjectTeacher();
            existingSubjectTeacher._id = existingRow.id;
            existingSubjectTeacher._subjectId = existingRow.subject_id;
            existingSubjectTeacher._teacherId = existingRow.teacher_id;
    
            return existingSubjectTeacher;
        }
    
        const insertSql = `INSERT INTO subject_teachers (subject_id, teacher_id) VALUES (?, ?)`;
        const result = db.prepare(insertSql).run(subjectId, teacherId);
    
        const subjectTeacher = new SubjectTeacher();
        subjectTeacher._id = result.lastInsertRowid as number;
        subjectTeacher._subjectId = subjectId;
        subjectTeacher._teacherId = teacherId;
    
        return subjectTeacher;
    }    

    public update(): void {}
    
    public static findByIdAndTeacher(subjectId: number, teacherId: number): SubjectTeacher {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subject_teachers WHERE subject_id = ? AND teacher_id = ?`;

        const stmnt = db.prepare(sql);
        const row: any = stmnt.get(subjectId, teacherId);

        if (!row) {
            throw new Error(`No subject teacher with subject id ${subjectId} and teacher id ${teacherId}`);
        } 

        const subjectTeacher = new SubjectTeacher();
        subjectTeacher._id = row.id;
        subjectTeacher._subjectId = row.subject_id;
        subjectTeacher._teacherId = row.teacher_id;

        return subjectTeacher;
    }

    public static findBySubject(subjectId: number): SubjectTeacher[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subject_teachers WHERE subject_id = ?`;

        const rows: any = db.prepare(sql).all(subjectId);

        //@ts-ignore
        return rows.map(row => {
            const subjectTeacher = new SubjectTeacher();
            subjectTeacher._id = row.id;
            subjectTeacher._subjectId = row.subject_id;
            subjectTeacher._teacherId = row.teacher_id;

            return subjectTeacher;
        });
    }

    public static findByTeacher(teacherId: number): SubjectTeacher[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subject_teachers WHERE teacher_id = ?`;

        const rows: any = db.prepare(sql).all(teacherId);

        //@ts-ignore
        return rows.map(row => {
            const subjectTeacher = new SubjectTeacher();
            subjectTeacher._id = row.id;
            subjectTeacher._subjectId = row.subject_id;
            subjectTeacher._teacherId = row.teacher_id;

            return subjectTeacher;
        });
    }

    public static getAll(): SubjectTeacher[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subject_teachers`;

        const rows: any = db.prepare(sql).all();

        //@ts-ignore
        return rows.map(row => {
            const subjectTeacher = new SubjectTeacher();
            subjectTeacher._id = row.id;
            subjectTeacher._subjectId = row.subject_id;
            subjectTeacher._teacherId = row.teacher_id;

            return subjectTeacher;
        });
    }

    public delete(): void {
        const sql = `DELETE FROM subject_teachers WHERE id = ?`;

        this.db.prepare(sql).run(this._id);
    }

    public toJSON() {
        return {
            id: this._id,
            subjectId: this._subjectId,
            teacherId: this._teacherId
        };
    }

    public get id(): number {
        return this._id;
    }

    public get subjectId(): number {
        return this._subjectId;
    }

    public set subjectId(subjectId: number) {
        this._subjectId = subjectId;
    }

    public get teacherId(): number {
        return this._teacherId;
    }

    public set teacherId(teacherId: number) {
        this._teacherId = teacherId;
    }
}

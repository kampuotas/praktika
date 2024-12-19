import type { Database } from "better-sqlite3";
import DatabaseSingleton from "$server";

import type { DatabaseRecord } from "$server/tables/DatabaseRecords";

export class GroupStudent implements DatabaseRecord {
    protected _id!: number;
    protected _groupId!: number;
    protected _studentId!: number;

    private db: Database;

    constructor() {
        this.db = DatabaseSingleton.getInstance();
    }

    public update(){}

    public static assign(groupId: number, studentId: number): GroupStudent {
        const db: Database = DatabaseSingleton.getInstance();

        const existsSql = `SELECT * FROM group_students WHERE group_id = ? AND student_id = ?`;
        const existingRow: any = db.prepare(existsSql).get(groupId, studentId);

        if (existingRow) {
            const existingGroupStudent = new GroupStudent();
            existingGroupStudent._id = existingRow.id;
            existingGroupStudent._groupId = existingRow.group_id;
            existingGroupStudent._studentId = existingRow.student_id;

            return existingGroupStudent;
        }

        const insertSql = `INSERT INTO group_students (group_id, student_id) VALUES (?, ?)`;
        const result = db.prepare(insertSql).run(groupId, studentId);

        const groupStudent = new GroupStudent();
        groupStudent._id = result.lastInsertRowid as number;
        groupStudent._groupId = groupId;
        groupStudent._studentId = studentId;

        return groupStudent;
    }

    public static findByGroup(groupId: number): GroupStudent[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM group_students WHERE group_id = ?`;

        const rows: any[] = db.prepare(sql).all(groupId);

        return rows.map(row => {
            const groupStudent = new GroupStudent();
            groupStudent._id = row.id;
            groupStudent._groupId = row.group_id;
            groupStudent._studentId = row.student_id;

            return groupStudent;
        });
    }

    public static findByStudent(studentId: number): GroupStudent[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM group_students WHERE student_id = ?`;

        const rows: any[] = db.prepare(sql).all(studentId);

        return rows.map(row => {
            const groupStudent = new GroupStudent();
            groupStudent._id = row.id;
            groupStudent._groupId = row.group_id;
            groupStudent._studentId = row.student_id;

            return groupStudent;
        });
    }

    public static findByIdAndStudent(groupId: number, studentId: number): GroupStudent {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM group_students WHERE group_id = ? AND student_id = ?`;

        const row: any = db.prepare(sql).get(groupId, studentId);

        if (!row) {
            throw new Error(`No group student with group id ${groupId} and student id ${studentId}`);
        } 

        const groupStudent = new GroupStudent();
        groupStudent._id = row.id;
        groupStudent._groupId = row.group_id;
        groupStudent._studentId = row.student_id;

        return groupStudent;
    }

    public static getAll(): GroupStudent[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM group_students`;

        const rows: any[] = db.prepare(sql).all();

        return rows.map(row => {
            const groupStudent = new GroupStudent();
            groupStudent._id = row.id;
            groupStudent._groupId = row.group_id;
            groupStudent._studentId = row.student_id;

            return groupStudent;
        });
    }

    public delete(): void {
        const sql = `DELETE FROM group_students WHERE id = ?`;
        this.db.prepare(sql).run(this._id);
    }

    public toJSON() {
        return {
            id: this._id,
            groupId: this._groupId,
            studentId: this._studentId,
        };
    }

    public get id(): number {
        return this._id;
    }

    public get groupId(): number {
        return this._groupId;
    }

    public set groupId(groupId: number) {
        this._groupId = groupId;
    }

    public get studentId(): number {
        return this._studentId;
    }

    public set studentId(studentId: number) {
        this._studentId = studentId;
    }
}

import type { Database } from "better-sqlite3";
import DatabaseSingleton from "$server";

import type { DatabaseRecord } from "$server/tables/DatabaseRecords";

export class SubjectGroup implements DatabaseRecord {
    protected _id!: number;
    protected _subjectId!: number;
    protected _groupId!: number;

    private db: Database;

    constructor() {
        this.db = DatabaseSingleton.getInstance();
    }

    public update(){}

    public static assign(subjectId: number, groupId: number): SubjectGroup {
        const db: Database = DatabaseSingleton.getInstance();
    
        const existsSql = `SELECT * FROM subject_groups WHERE group_id = ?`;
        const existingRow: any = db.prepare(existsSql).get(groupId);
    
        if (existingRow) {
            const updateSql = `UPDATE subject_groups SET subject_id = ? WHERE id = ?`;
            db.prepare(updateSql).run(subjectId, existingRow.id);
    
            const updatedSubjectGroup = new SubjectGroup();
            updatedSubjectGroup._id = existingRow.id;
            updatedSubjectGroup._subjectId = subjectId;
            updatedSubjectGroup._groupId = groupId;
    
            return updatedSubjectGroup;
        }
    
        const insertSql = `INSERT INTO subject_groups (subject_id, group_id) VALUES (?, ?)`;
        const result = db.prepare(insertSql).run(subjectId, groupId);
    
        const subjectGroup = new SubjectGroup();
        subjectGroup._id = result.lastInsertRowid as number;
        subjectGroup._subjectId = subjectId;
        subjectGroup._groupId = groupId;
    
        return subjectGroup;
    }    

    public static findBySubject(subjectId: number): SubjectGroup[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subject_groups WHERE subject_id = ?`;

        const rows: any[] = db.prepare(sql).all(subjectId);

        return rows.map(row => {
            const subjectGroup = new SubjectGroup();
            subjectGroup._id = row.id;
            subjectGroup._subjectId = row.subject_id;
            subjectGroup._groupId = row.group_id;

            return subjectGroup;
        });
    }

    public static findByGroup(groupId: number): SubjectGroup[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subject_groups WHERE group_id = ?`;

        const rows: any[] = db.prepare(sql).all(groupId);

        return rows.map(row => {
            const subjectGroup = new SubjectGroup();
            subjectGroup._id = row.id;
            subjectGroup._subjectId = row.subject_id;
            subjectGroup._groupId = row.group_id;

            return subjectGroup;
        });
    }

    public static getAll(): SubjectGroup[] {
        const db: Database = DatabaseSingleton.getInstance();
        const sql = `SELECT * FROM subject_groups`;

        const rows: any[] = db.prepare(sql).all();

        return rows.map(row => {
            const subjectGroup = new SubjectGroup();
            subjectGroup._id = row.id;
            subjectGroup._subjectId = row.subject_id;
            subjectGroup._groupId = row.group_id;

            return subjectGroup;
        });
    }

    public delete(): void {
        const sql = `DELETE FROM subject_groups WHERE id = ?`;
        this.db.prepare(sql).run(this._id);
    }

    public toJSON() {
        return {
            id: this._id,
            subjectId: this._subjectId,
            groupId: this._groupId,
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

    public get groupId(): number {
        return this._groupId;
    }

    public set groupId(groupId: number) {
        this._groupId = groupId;
    }
}

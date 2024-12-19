import { User } from "./User";

import DatabaseSingleton from "$server";

export class Student extends User {
    constructor() {
        super();
    }

    public static getAll(): Student[] {
        const students = super.getAll("Student");
        return students.map(student => Object.assign(new Student(), student));
    }

    public static findById(id: number): Student | null {
        const db = DatabaseSingleton.getInstance();

        const sql = `SELECT * FROM users WHERE id = ? AND role = 'Student'`;
        const row: any = db.prepare(sql).get(id);

        if (!row) {
            return null;
        }

        const student = new Student();
        student.id = row.id;
        student.username = row.username;
        student.password = row.password;
        student.role = row.role;
        student.name = row.name;
        student.surname = row.surname;

        return student;
    }

    getGrades() {
        const db = DatabaseSingleton.getInstance();
    
        const sql = `
            SELECT 
                g.grade,
                s.name AS subject_name,
                t.name || ' ' || t.surname AS teacher_fullname,
                DATETIME(g.datetime / 1000, 'unixepoch') AS formatted_datetime
            FROM grades g
            INNER JOIN groups gr ON g.group_id = gr.id
            INNER JOIN subject_groups sg ON gr.id = sg.group_id
            INNER JOIN subjects s ON sg.subject_id = s.id
            INNER JOIN subject_teachers st ON s.id = st.subject_id
            INNER JOIN users t ON st.teacher_id = t.id
            WHERE g.student_id = ?
            GROUP BY g.id;
        `;
    
        const rows: any[] = db.prepare(sql).all(this.id);
    
        return rows.map(row => ({
            grade: row.grade,
            subject: row.subject_name,
            teacher: row.teacher_fullname,
            datetime: row.formatted_datetime
        }));
    }
    
}
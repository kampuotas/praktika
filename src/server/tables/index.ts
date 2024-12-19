import type { Database } from "better-sqlite3";


export function addUserTable(database: Database) {
	const sql = `
	create table if not exists users (
		id          integer primary key autoincrement,
		username    text not null,
        password    text not null,
        role        text not null,
        name        text not null,
        surname     text not null
	);`;

    
	const stmnt = database.prepare(sql);
	stmnt.run();
}

export function addGradesTable(database: Database) {
	const sql = `
    create table if not exists grades (
        id          integer primary key autoincrement,
        datetime    integer not null default (strftime('%s', 'now') * 1000),
        student_id  integer not null,
        group_id     integer not null,
        grade      integer not null
    );`;

	const stmnt = database.prepare(sql);
	stmnt.run();
}

export function addSubjectsTable(database: Database) {
    const sql = `
    create table if not exists subjects (
        id          integer primary key autoincrement,
        name        text not null
    );`;

    const stmnt = database.prepare(sql);
    stmnt.run();
}

export function addSubjectTeacherTable(database: Database) {
    const sql = `
    create table if not exists subject_teachers (
        id          integer primary key autoincrement,
        subject_id  integer not null,
        teacher_id  integer not null
    );`;

    const stmnt = database.prepare(sql);
    stmnt.run();
}

export function addGroupTable(database: Database) {
    const sql = `
    CREATE TABLE IF NOT EXISTS groups (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT NOT NULL,
        description TEXT
    );`;

    const stmnt = database.prepare(sql);
    stmnt.run();
}

export function addGroupStudentTable(database: Database) {
    const sql = `
    CREATE TABLE IF NOT EXISTS group_students (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id    INTEGER NOT NULL,
        student_id  INTEGER NOT NULL
    );`;

    const stmnt = database.prepare(sql);
    stmnt.run();
}

export function addSubjectGroupTable(database: Database) {
    const sql = `
    CREATE TABLE IF NOT EXISTS subject_groups (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id  INTEGER NOT NULL,
        group_id    INTEGER NOT NULL
    );`;

    const stmnt = database.prepare(sql);
    stmnt.run();
}
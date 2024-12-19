import Database from 'better-sqlite3';
import type { Database as DBType } from "better-sqlite3";
import { DB_PATH } from '$env/static/private';
import { addUserTable, addGradesTable, addSubjectsTable, addSubjectTeacherTable, addGroupTable, addGroupStudentTable, addSubjectGroupTable } from './tables';

// TABLE IMPORTS

class DatabaseSingleton {
  private static instance: DBType | null = null;

  private constructor() {}

  public static getInstance(): DBType {
    if (!DatabaseSingleton.instance) {
      console.log('Initializing database instance...');
      DatabaseSingleton.instance = new Database(DB_PATH, { verbose: console.log });
    //   DatabaseSingleton.instance = new Database(DB_PATH);
      DatabaseSingleton.setupTables(DatabaseSingleton.instance);
    }
    return DatabaseSingleton.instance;
  }

  private static setupTables(db: DBType): void {
    addUserTable(db);
    addGradesTable(db);
    addSubjectsTable(db);
    addSubjectTeacherTable(db);
    addGroupTable(db);
    addGroupStudentTable(db);
    addSubjectGroupTable(db);
  }
}

export default DatabaseSingleton;

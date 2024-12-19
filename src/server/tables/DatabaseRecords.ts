export interface DatabaseRecord {
    id: number;
  
    toJSON(): Object;
    update(): void;
    delete(): void;
}
export interface IDBClient {
  connect(uri: string): Promise<void>;
  disconnect():Promise<void>;
}

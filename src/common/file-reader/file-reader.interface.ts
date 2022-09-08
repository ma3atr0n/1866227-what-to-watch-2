export interface IFileReader {
  readonly fileName: string;
  read(): void;
}

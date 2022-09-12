export interface IFileWriter {
	readonly fileName: string;
	write(row: string): void
}

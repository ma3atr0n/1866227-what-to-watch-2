export interface ILogger {
	info(message: string, ...parameters: undefined[]): void;
	warn(message: string, ...parameters: undefined[]): void;
	error(message: string, ...parameters: undefined[]): void;
	debug(message: string, ...parameters: undefined[]): void;
}

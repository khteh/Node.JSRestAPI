/*
declare namespace winston {
  interface AbstractConfigSetLevels {
    [key: string]: number;
  }
*/
export interface LogLevelsType {
  [key: string]: number;
}
const LogLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}
export interface ILogger {
  Log (level: number, message: string): void;
}
export { LogLevels }
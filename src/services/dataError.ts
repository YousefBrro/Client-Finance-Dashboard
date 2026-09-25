export type DataErrorCode = 'network' | 'not-found' | 'format' | 'unknown';

export class DataError extends Error {
  readonly code: DataErrorCode;

  constructor(code: DataErrorCode) {
    super(code);
    this.name = 'DataError';
    this.code = code;
  }
}

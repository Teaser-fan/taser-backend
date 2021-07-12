export interface IErrorResponse {
  status: number;
  message: string;
}

export class ErrorResponse implements IErrorResponse {
  status: number;
  message: string;

  public constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

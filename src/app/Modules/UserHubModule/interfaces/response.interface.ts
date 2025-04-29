export interface IResponse<T> {
  code: string;
  msg: string;
  result: T;
}

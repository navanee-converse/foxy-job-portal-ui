export interface Response<T = undefined> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}

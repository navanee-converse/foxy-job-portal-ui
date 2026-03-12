import type { PaginationMeta } from "./pagination";

export interface Response<T = undefined> extends Partial<PaginationMeta> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  status?: number;
}

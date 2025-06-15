interface ApiMessage {
  content: string;
  displayable: boolean;
}

export interface CommonResponse<T> {
  success: boolean;
  message: ApiMessage;
  data: T;
}

export interface PaginatedData<T> {
  records: T;
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export type PaginatedResponse<T> = CommonResponse<PaginatedData<T>>;

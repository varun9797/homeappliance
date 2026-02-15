export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

import { AppError } from "./app-error";

export const ERRORS = {
  INVALID_REQUEST_BODY: "Invalid request body",
  INVALID_CREDENTIALS: "Invalid credentials",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
} as const;

export const Errors = {
  InvalidRequestBody: () =>
    new AppError(ERRORS.INVALID_CREDENTIALS, 400),

  InvalidCredentials: () =>
    new AppError(ERRORS.INVALID_CREDENTIALS, 401),
};
import { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: ContentfulStatusCode
  ) {
    super(message)
  }
}
import { HttpException, HttpStatus } from "@nestjs/common";

type ResponseErrorBadInput<T extends { [key: string]: any }> = {
  [P in keyof T]: {
    message: string;
    value?: any;
    metaData?: any;
  };
};

export class ResponseError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
  }
  static alreadyExists(message: string): ResponseError {
    throw new HttpException(message || "not found", 430);
  }

  static notFound(message: string): ResponseError {
    throw new HttpException(message || "not found", HttpStatus.NOT_FOUND);
  }

  static badInput<T>(object: ResponseErrorBadInput<T> | string): ResponseError {
    throw new HttpException(object, HttpStatus.BAD_REQUEST);
  }

  static conflict(message: string): ResponseError {
    throw new HttpException(message || "not found", HttpStatus.CONFLICT);
  }

  static lengthRequired(message: string): ResponseError {
    throw new HttpException(message || "not found", HttpStatus.LENGTH_REQUIRED);
  }

  static unexpected(message: string): ResponseError {
    throw new HttpException(
      message || "not found",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  static unauthenticated(message: string): ResponseError {
    throw new HttpException(
      message || "Authenticated",
      HttpStatus.UNAUTHORIZED
    );
  }

  static unauthorized(message: string = "Unauthorized"): ResponseError {
    throw new HttpException(message, HttpStatus.FORBIDDEN);
  }
}

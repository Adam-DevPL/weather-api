import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CoordinatesException,
  LocationException,
} from './exceptions/exceptions';

type ErrorResp = {
  status: number;
  message: string;
};

const getStatusAndErrorMsg = <T>(exception: T): ErrorResp => {
  if (exception instanceof HttpException) {
    return {
      status: exception.getStatus(),
      message: exception.message,
    };
  }

  if (
    exception instanceof LocationException ||
    exception instanceof CoordinatesException
  ) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: String(exception.message),
    };
  }

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  };
};

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, message } = getStatusAndErrorMsg(exception);

    response.status(status).json({
      status,
      message,
    });
  }
}

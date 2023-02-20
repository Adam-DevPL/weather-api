import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FetchDataApiException } from './exceptions/fetch-data-api.exception';

@Catch(FetchDataApiException)
export class FetchDataApiFilter implements ExceptionFilter {
  catch({ message }: FetchDataApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    let status = HttpStatus.BAD_REQUEST;

    if (
      !(
        message.includes('Location not found') ||
        message.includes('Invalid coordinates')
      )
    ) {
      message = 'Internal server error';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}

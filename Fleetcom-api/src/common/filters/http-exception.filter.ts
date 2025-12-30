/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : 500;

    console.error('ERRO CAPTURADO NO FILTER:');
    console.error('-> Message:', exception.message);
    // console.error('-> Stack:', exception.stack);
    // console.error('-> Response:', exception.response);
    // console.error('-> Nome:', exception.name);
    // console.error('-> Completo:', exception);

    const message = isHttpException
      ? exception.getResponse()
      : {
          message: exception.message ?? 'Erro interno no servidor.',
          error: exception.name ?? 'InternalError',
        };

    response.status(status).json(message);
  }
}

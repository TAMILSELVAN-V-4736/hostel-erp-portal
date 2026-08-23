import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Format validation errors nicely
    let formattedMessage = 'An unexpected error occurred';
    
    if (typeof message === 'string') {
      formattedMessage = message;
    } else if (typeof message === 'object' && message !== null) {
      if ('message' in message) {
        if (Array.isArray((message as any).message)) {
          formattedMessage = (message as any).message[0]; // Get the first validation error
        } else {
          formattedMessage = (message as any).message;
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      message: formattedMessage,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}

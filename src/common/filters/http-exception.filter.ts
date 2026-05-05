import { 
  ArgumentsHost, 
  Catch,
  ExceptionFilter, 
  HttpException, 
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    // fallback exception
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    // If it's a known HTTP exception
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const errorResponse = exception.getResponse()

      if (typeof errorResponse === 'string' ) {
        message = errorResponse
      } else if(typeof errorResponse === 'object' && errorResponse !== null) {
        const msg = (errorResponse as any)?.message;

        if (Array.isArray(msg)) {
          message = msg.join(', ');
        } else {
          message = msg ?? message;
        }

      }
    }

    // Log error internally
    console.error({
      message: exception instanceof Error ? exception.message : 'Exceptions caught',
      stack: exception instanceof Error ? exception.stack : undefined,
      path: request.url,
      method: request.method,
    });

    return response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url
    })

  }
}

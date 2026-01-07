import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Record<string, any>) => {
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          message: 'Operação realizada com sucesso',
        };
      }),
    );
  }
}

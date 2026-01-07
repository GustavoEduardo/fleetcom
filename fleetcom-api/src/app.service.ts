import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'success',
      code: 200,
      message: 'Fleetcom is working',
    };
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api-rersponse.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private API_URL = environment.apiUrl + '/user';

  constructor(private http: HttpClient) {}

  getLoggedUserInfo(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/info`);
  }

  editUser(
    id: string,
    data: Partial<User>
  ): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(
      `${this.API_URL}/${id}`,
      data
    );
  }

  uploadAvatar(userId: string, formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/${userId}/avatar`, formData);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private API_URL = environment.apiUrl + '/user';

  constructor(private http: HttpClient) {}

  getLoggedUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/info`);
  }

  editUser(id: string, data: Partial<User>): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}`, data);
  }

  uploadAvatar(userId: string, formData: FormData): Observable<any> {

    return this.http.post(`${this.API_URL}/${userId}/avatar`, formData);
  }
}

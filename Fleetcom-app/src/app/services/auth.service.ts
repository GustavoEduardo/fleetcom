import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();
  
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    this.loggedIn.next(true);
    return this.http.post(`${this.API_URL}/auth/login`, data);
  }

  saveToken(access_token: string) {
    localStorage.setItem('access_token', access_token);
  }

  isLogged(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('access_token');
  }
}

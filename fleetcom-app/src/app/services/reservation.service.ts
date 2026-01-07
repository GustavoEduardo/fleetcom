import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewReservation, Reservation } from '../model/reservation.model';
import { ApiResponse } from '../model/api-rersponse.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private API_URL = environment.apiUrl + '/reservation';

  constructor(private http: HttpClient) {}

  getReservatonsLoggedUser(queryString: string): Observable<ApiResponse<Reservation[]>> {
    return this.http.get<ApiResponse<Reservation[]>>(
      `${this.API_URL}/by-user?${queryString}`
    );
  }

  reserveVehicle(data: NewReservation): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}`, data);
  }

  calcel(id: string): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.API_URL}/${id}/cancel`, {});
  }
}

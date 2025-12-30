import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewReservation, Reservation } from '../model/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private API_URL = environment.apiUrl + '/reservation';

  constructor(private http: HttpClient) {}

  getReservatonsLoggedUser(queryString: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.API_URL}/by-user?${queryString}`
    );
  }

  reserveVehicle(data: NewReservation): Observable<any> {
    return this.http.post(`${this.API_URL}`, data);
  }

  calcel(id: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/cancel`, {});
  }
}

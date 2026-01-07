import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Vehicle, VehicleFiltersResponse } from '../model/vehicle.model';
import { ApiResponse } from '../model/api-rersponse.model';

@Injectable({
  providedIn: 'root',
})
export class VehiclesService {
  private API_URL = environment.apiUrl + '/vehicle';

  constructor(private http: HttpClient) {}

  getVehicles(queryString: string): Observable<ApiResponse<Vehicle[]>> {
    return this.http.get<ApiResponse<Vehicle[]>>(`${this.API_URL}?${queryString}`);
  }

  getFilters(): Observable<ApiResponse<VehicleFiltersResponse>> {
    return this.http.get<ApiResponse<VehicleFiltersResponse>>(`${this.API_URL}/filters`);
  }
}

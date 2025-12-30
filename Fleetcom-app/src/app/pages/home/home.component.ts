import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { environment } from '../../../app/environments/environment';
import { CardCarComponent } from '../../shared/components/card-car/card-car.component';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../model/reservation.model';
import { CarrosselComponent } from '../../shared/components/carrossel/carrossel.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { buildQueryParams } from '../../utils/query-string.util';
import { FiltersVehiclesComponent } from '../../shared/components/filters-vehicles/filters-vehicles.component';
import { ButtonIconComponent } from '../../shared/components/button-icon/button-icon.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from '../../shared/components/loading-button/loading-button.component';
import { TabsNavigationComponent } from '../../shared/components/tabs-navigation/tabs-navigation.component';
import { DrawerComponent } from '../../shared/components/drawer/drawer.component';
import { SnackService } from '../../services/snack-bar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardCarComponent,
    CarrosselComponent,
    SearchComponent,
    FiltersVehiclesComponent,
    ButtonIconComponent,
    LoadingComponent,
    CommonModule,
    LoadingButtonComponent,
    TabsNavigationComponent,
    DrawerComponent,
    MatSnackBarModule,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  api = environment.apiUrl;

  user!: User;
  reservations: Reservation[] = [];

  searchTimeout: any;
  search: string = '';
  drawerOpen = false;

  loadingCars = true;
  noReservations = false;

  constructor(
    private userService: UserService,
    private reservationService: ReservationService,
    private snackService: SnackService,
    private router: Router,
    private authService: AuthService
  ) {
    this.getLoggedUserInfo();
  }

  getLoggedUserInfo() {
    this.userService.getLoggedUserInfo().subscribe({
      next: (res) => {
        this.user = res;

        this.getReservatonsLoggedUser();
      },
      error: (err) => {
        if (err.error.message.includes('encontrado')) {
          localStorage.removeItem('access_token');
          this.router.navigate(['/login']);
        }
        this.snackService.error(
          err.error.message || 'Erro inesperado ao tentar validar token'
        );
      },
    });
  }

  getReservatonsLoggedUser(filtros?: FormGroup) {
    const filters: Record<string, any> = {
      ...filtros,
    };

    if (this.search) {
      filters['search'] = this.search;
    }

    const queryString = buildQueryParams(filters);

    this.loadingCars = true;

    this.reservationService.getReservatonsLoggedUser(queryString).subscribe({
      next: (res) => {
        this.reservations = res;

        this.noReservations = this.reservations.length === 0;
        this.loadingCars = false;

        this.openFilters(false);
      },
      error: (err) => {
        this.loadingCars = false;
        this.snackService.error(
          err.error.message ||
            'Erro inesperado ao tentar listar últimas reservas'
        );
      },
    });
  }

  onSearchChange(search: string) {
    clearTimeout(this.searchTimeout);

    this.search = search || '';

    this.searchTimeout = setTimeout(() => {
      this.getReservatonsLoggedUser();
    }, 600);
  }

  openFilters(open: boolean) {
    this.drawerOpen = open;
  }

  toReservations() {
    this.router.navigate(['/reservations']);
  }

  logout() {
    this.router.navigate(['/login']);
    this.snackService.success('Deslogado com sucesso');
    this.authService.logout();
  }
}

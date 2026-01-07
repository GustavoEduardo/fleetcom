import { Component } from '@angular/core';
import { Reservation } from '../../model/reservation.model';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CarrosselComponent } from '../../shared/components/carrossel/carrossel.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { CardCarComponent } from '../../shared/components/card-car/card-car.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { ButtonIconComponent } from '../../shared/components/button-icon/button-icon.component';
import { DrawerComponent } from '../../shared/components/drawer/drawer.component';
import { LoadingButtonComponent } from '../../shared/components/loading-button/loading-button.component';
import { Vehicle } from '../../model/vehicle.model';
import { ReservationService } from '../../services/reservation.service';
import { SnackService } from '../../services/snack-bar.service';
import { VehiclesService } from '../../services/vehicles.service';
import { buildQueryParams } from '../../utils/query-string.util';
import { Router } from '@angular/router';
import { FiltersVehiclesComponent } from '../../shared/components/filters-vehicles/filters-vehicles.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CarrosselComponent,
    LoadingComponent,
    CardCarComponent,
    CommonModule,
    SearchComponent,
    ButtonIconComponent,
    DrawerComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    LoadingButtonComponent,
    FiltersVehiclesComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {
  reservations: Reservation[] = [];
  vehicles: Vehicle[] = [];

  searchTimeout: any;
  search: string = '';
  drawerOpen = false;
  loadingCars = false;

  filtrosSelecionados = {};

  reservationForm: FormGroup;
  filterVehiclesForm: FormGroup;

  loadingCreate = false;
  noReservations = false;
  firstLoad = true;

  constructor(
    private reservationService: ReservationService,
    private snackService: SnackService,
    private vehiclesService: VehiclesService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.reservationForm = this.fb.group(
      {
        vehicleId: ['', Validators.required],
        reservedFrom: ['', Validators.required],
        reservedUntil: ['', Validators.required],
      },
      { validators: [this.validateStartDate] }
    );

    this.filterVehiclesForm = this.fb.group({
      type: [''],
      engine: [''],
      status: ['AVAILABLE'],
      year: [''],
      size: [''],
    });

    this.getReservatonsLoggedUser();
  }

  ngOnInit() {
    this.reservationForm.statusChanges.subscribe((status: string) => {
      if (status === 'VALID') {
        setTimeout(() => {
          document.getElementById('btReservar')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 200);
      }
    });
  }

  getReservatonsLoggedUser(filtros?: FormGroup) {
    const filters: Record<string, any> = {
      status: 'RESERVED',
      ...filtros,
    };

    if (this.search) {
      filters['search'] = this.search;
    }

    const queryString = buildQueryParams(filters);

    this.loadingCars = true;

    if (this.noReservations && !this.firstLoad) {
      this.getVehicles(filtros);
      return;
    }

    this.reservationService.getReservatonsLoggedUser(queryString).subscribe({
      next: (res) => {
        this.reservations = res.data;

        this.noReservations = this.reservations.length === 0;

        if (this.noReservations && this.firstLoad) {
          this.getVehicles(filtros);
        } else {
          this.loadingCars = false;
          this.openFilters(false);
          setTimeout(() => {
            this.firstLoad = false;
          }, 400);
        }
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

  getVehicles(filtros?: FormGroup) {
    const filters: Record<string, any> = {
      status: 'AVAILABLE',
      ...filtros,
    };

    if (this.search) {
      filters['search'] = this.search;
    }

    const queryString = buildQueryParams(filters);

    this.loadingCars = true;

    this.vehiclesService.getVehicles(queryString).subscribe({
      next: (res) => {
        this.vehicles = res.data;
        this.loadingCars = false;

        this.openFilters(false);

        setTimeout(() => {
          this.firstLoad = false;
        }, 400);
      },
      error: (err) => {
        this.loadingCars = false;
        this.snackService.error(
          err.error.message || 'Erro inesperado ao tentar listar os veículos'
        );
      },
    });
  }

  onSearchChange(search: string) {
    clearTimeout(this.searchTimeout);

    this.search = search || '';

    this.searchTimeout = setTimeout(() => {
      this.getVehicles();
    }, 200);
  }

  openFilters(open: boolean) {
    this.drawerOpen = open;
  }

  selectCar(car: Vehicle) {
    this.reservationForm.get('vehicleId')?.setValue(car.id);

    setTimeout(() => {
      document.getElementById('selectTimeRange')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 800);
  }

  reserveVehicle() {
    if (this.reservationForm.valid) {
      this.loadingCreate = true;
      this.reservationService
        .reserveVehicle(this.reservationForm.value)
        .subscribe({
          next: (res) => {
            this.loadingCreate = false;
            this.snackService.success(
              res.message || 'Reserva realizada com sucesso'
            );
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.loadingCreate = false;
            this.snackService.error(
              err.error.message || 'Erro inesperado ao tentar incluir a reserva'
            );
          },
        });
    }
  }

  cancel() {
    this.loadingCreate = true;
    this.reservationService.calcel(this.reservations[0].id).subscribe({
      next: (res) => {
        this.loadingCreate = false;
        this.snackService.success(
          res.message || 'Reserva cancelada com sucesso'
        );
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loadingCreate = false;
        this.snackService.error(
          err.error.message || 'Erro inesperado ao tentar cancelar a reserva'
        );
      },
    });
  }

  validateStartDate(form: AbstractControl): ValidationErrors | null {
    const reservedFrom = form.get('reservedFrom')?.value;
    const today = new Date();

    if (!reservedFrom) return null;

    const selectedDate = new Date(reservedFrom);

    if (selectedDate < new Date(today.toDateString())) {
      form.get('reservedFrom')?.setErrors({ invalidPastDate: true });
      return { invalidPastDate: true };
    }

    return null;
  }
}

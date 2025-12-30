import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  Input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from '../loading-button/loading-button.component';
import { VehiclesService } from '../../../services/vehicles.service';
import { buildQueryParams } from '../../../utils/query-string.util';
import { SnackService } from '../../../services/snack-bar.service';

@Component({
  selector: 'app-filters-vehicles',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    LoadingButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './filters-vehicles.component.html',
  styleUrl: './filters-vehicles.component.scss',
})
export class FiltersVehiclesComponent {
  @Input() loading = false;
  @Input() search = null;

  @Output() filterChange = new EventEmitter<any>();
  @Output() closeDrawer = new EventEmitter<any>();
  @Output() confirmFilter = new EventEmitter<any>();

  filtrosVisible = false;

  filters: any = {
    type: {},
    engine: '',
    size: '',
  };

  filterForm: FormGroup;

  vehicleTypes: string[] = [];
  engines: string[] = [];
  seats: string[] = [];

  accordionOpen = {
    type: true,
    engine: false,
    size: false,
  };

  @ViewChild('drawer') drawer!: any;

  constructor(
    private fb: FormBuilder,
    private vehiclesService: VehiclesService,
    private snackService: SnackService
  ) {
    this.filterForm = this.fb.group({
      type: [[]],
      engine: [[]],
      status: [[]],
      year: [[]],
      size: [[]],
    });

    this.getVehiclesFilters();
  }

  getVehiclesFilters() {
    this.vehiclesService.getFilters().subscribe({
      next: (res) => {
        this.engines = res[0].engines.map((e: any) => e.value);
        this.seats = res[0].sizes.map((s: any) => s.value);
        this.vehicleTypes = res[0].types.map((t: any) => t.value);
      },
      error: (err) => {
        this.snackService.error(
          err.error.message || 'Erro inesperado ao tentar listar os filtros'
        );
      },
    });
  }

  toggleFilter(control: string, value: any) {
    const array = [...this.filterForm.value[control]];

    if (array.includes(value)) {
      this.filterForm.patchValue({
        [control]: array.filter((v) => v !== value),
      });
    } else {
      array.push(value);
      this.filterForm.patchValue({ [control]: array });
    }
  }

  close() {
    this.closeDrawer.emit();
  }

  reset() {
    this.filterForm = this.fb.group({
      type: [[]],
      engine: [[]],
      status: [[]],
      year: [[]],
      size: [[]],
    });
  }

  applyFilters() {
    const rawValue = this.filterForm.value;

    const typeArray = Object.keys(rawValue.type).filter(
      (key) => rawValue.type[key]
    );

    const processed = {
      ...rawValue,
      type: typeArray,
    };

    this.filterChange.emit(processed);
  }

  toggleAccordion(key: 'type' | 'engine' | 'size') {
    this.accordionOpen[key] = !this.accordionOpen[key];
  }

  filtrar() {
    const filtros = Object.fromEntries(
      Object.entries(this.filterForm.value).filter(([_, value]) =>
        Array.isArray(value) ? value.length > 0 : !!value
      )
    );

    this.confirmFilter.emit(filtros);
  }
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackService {
  constructor(private snack: MatSnackBar) {}

  success(message: string) {
    this.openSnack(message, 'snackbar-success');
  }

  error(message: string) {
    this.openSnack(message, 'snackbar-error');
  }

  warning(message: string) {
    this.openSnack(message, 'snackbar-warning');
  }

  info(message: string) {
    this.openSnack(message, 'snackbar-info');
  }

  private openSnack(message: string, panelClass: string) {
    this.snack.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoadingButtonComponent } from '../../shared/components/loading-button/loading-button.component';
import { SnackService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingButtonComponent,
  ],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLogin: FormGroup;
  loadingBt = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackService: SnackService
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.formLogin.valid) {
      this.loadingBt = true;

      this.auth.login(this.formLogin.value).subscribe({
        next: (res: any) => {
          this.auth.saveToken(res.access_token);
          this.loadingBt = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.loadingBt = false;
          this.snackService.error(
            err.error.message || 'Erro ao tentar efetuar o login'
          );
        },
      });
    }
  }
}

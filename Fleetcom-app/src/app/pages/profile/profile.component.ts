import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../../model/user.model';
import { UserService } from '../../services/user.service';
import { SnackService } from '../../services/snack-bar.service';
import { Router } from '@angular/router';
import { LoadingButtonComponent } from '../../shared/components/loading-button/loading-button.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    LoadingButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    MatIcon,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  api = environment.apiUrl;
  user!: User;

  loading = true;

  formUser: FormGroup;

  disabled = true;
  editing = false;
  editPass = false;

  hover = false;

  showPass = false;
  showConfirmPass = false;
  showOldPass = false;

  @ViewChild('inputName') inputEl!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private snackService: SnackService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.getLoggedUserInfo();

    // Validators.email

    this.formUser = this.fb.group(
      {
        email: [null, Validators.required],
        name: [null, Validators.required],
        password: [null],
        password_confirm: [null],
        old_password: [null],
      },
      { validators: this.passwordsMatchValidator() }
    );
  }

  getLoggedUserInfo() {
    this.userService.getLoggedUserInfo().subscribe({
      next: (res) => {
        this.user = res;
        this.formUser.get('name')?.setValue(res.name);
        this.formUser.get('email')?.setValue(res.email);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snackService.error(
          err.error.message || 'Erro inesperado ao tentar validar token'
        );
      },
    });
  }

  enableWEdit(enable: boolean) {
    this.disabled = !enable;
    this.editing = enable;

    if (enable) {
      this.inputEl.nativeElement.focus();
    } else {
      this.inputEl.nativeElement.blur();
    }
  }

  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirm = control.get('password_confirm')?.value;

      return password && confirm && password !== confirm
        ? { passwordsNotMatch: true }
        : null;
    };
  }

  cancelEdit() {
    this.disabled = true;
    this.editing = false;
    this.enableEditPass(false);
  }

  save() {
    if (this.formUser.valid) {
      this.userService.editUser(this.user._id, this.formUser.value).subscribe({
        next: (res) => {
          this.loading = false;

          this.enableWEdit(false);

          this.snackService.success(
            res.message || 'Edição realizada com sucesso'
          );

          this.disabled = true;
          this.editing = false;
          this.enableEditPass(false);
        },
        error: (err) => {
          this.loading = false;

          this.snackService.error(
            err.error.message || 'Erro inesperado ao tentar salvar as informações'
          );
        },
      });
    }
  }

  selecionarImagemClick() {
    this.fileInput.nativeElement.click();
  }

  uploadAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const formData = new FormData();
    formData.append('file', input.files[0]);

    this.userService.uploadAvatar(this.user._id, formData).subscribe({
      next: (res) => {
        this.loading = false;

        this.enableWEdit(false);

        this.snackService.success(
          res.message || 'Edição realizada com sucesso'
        );

        this.getLoggedUserInfo();
      },
      error: (err) => {
        this.loading = false;

        this.snackService.error(
          err.error.message || 'Erro inesperado ao tentar alterar a imagem'
        );
      },
    });
  }

  enableEditPass(enable: boolean = true) {
    this.editPass = enable;

    if (enable) {
      this.formUser
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
      this.formUser
        .get('password_confirm')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
      this.formUser.get('old_password')?.setValidators([Validators.required]);
    } else {
      this.formUser.get('password')?.clearValidators();
      this.formUser.get('password_confirm')?.clearValidators();
      this.formUser.get('old_password')?.clearValidators();
      this.formUser.get('name')?.setValue(this.user.name);
      this.formUser.get('email')?.setValue(this.user.email);

      this.formUser.patchValue({
        password: null,
        password_confirm: null,
        old_password: null,
      });
    }

    this.formUser.get('password')?.updateValueAndValidity();
    this.formUser.get('password_confirm')?.updateValueAndValidity();
    this.formUser.get('old_password')?.updateValueAndValidity();

    this.formUser.updateValueAndValidity();
  }
}

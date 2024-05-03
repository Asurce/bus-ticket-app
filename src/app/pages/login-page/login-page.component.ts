import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {AuthService} from "../../shared/services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {TicketService} from "../../shared/services/ticket.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatCard,
    MatError,
    MatCardContent,
    RouterLink,
    MatCardFooter,
    MatProgressBar
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {

  form!: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ticketService: TicketService,
    private snackService: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.emailControl.value, this.passwordControl.value)!.then(auth => {
      if (this.ticketService.pendingTicket) {
        const resolve = this.ticketService.resolvePendingPurchase(auth.user!.uid);
        if (resolve) {
          resolve.then(id => this.router.navigateByUrl('/tickets/' + id.id))
        }
      }
      this.loading = false;
      this.router.navigateByUrl('/')
    }).catch(() => {
      this.loading = false;
      this.snackService.open('Hibás felhasználónév vagy jelszó.', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000
      });
    })


  }

  get emailControl(): FormControl {
    return this.form.controls['email'] as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.controls['password'] as FormControl;
  }

}

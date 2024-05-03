import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import {UserService} from "../../shared/services/user.service";
import {User} from "../../shared/models/User";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TicketService} from "../../shared/services/ticket.service";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatInput,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatCardFooter,
    MatProgressBar
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent implements OnInit {

  form!: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private snackService: MatSnackBar,
    private ticketService: TicketService
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, this.matchValues('password')]]
    })
  }

  onSubmit() {
    this.loading = true;
    this.authService.register(this.emailControl.value, this.passwordControl.value).then(value => {
      const user: User = {
        id: value.user!.uid,
        email: this.emailControl.value,
        name: {
          firstName: this.firstNameControl.value,
          lastName: this.lastNameControl.value
        }
      }
      this.userService.create(user).then(() => {
        if (this.ticketService.pendingTicket) {
          const resolve = this.ticketService.resolvePendingPurchase(value.user!.uid);
          if (resolve) {
            resolve.then(id => {
              this.loading = false;
              this.router.navigateByUrl('/tickets/' + id.id)
            })
          }
        }
        this.router.navigateByUrl('/');
      })
    }).catch(() => {
      this.loading = false;
      this.snackService.open('Van már ilyen email az adatbázisban.', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000
      });
    })
  }

  matchValues(matchTo: string): (ac: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
      !!control.parent.value &&
      control.value === control.parent.get(matchTo)?.value
        ? null
        : {isMatching: false};
    };
  }

  get lastNameControl(): FormControl {
    return this.form.controls['lastName'] as FormControl;
  }

  get firstNameControl(): FormControl {
    return this.form.controls['firstName'] as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.controls['email'] as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.controls['password'] as FormControl;
  }

  get passwordConfirmControl(): FormControl {
    return this.form.controls['passwordConfirm'] as FormControl;
  }
}

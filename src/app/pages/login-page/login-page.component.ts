import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {AuthService} from "../../shared/services/auth.service";
import {Router, RouterLink} from "@angular/router";

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
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  serverMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit() {
    try {
      this.authService.login(this.emailControl.value, this.passwordControl.value).then(async () => {
        console.log('asdasd')
        this.router.navigate(['/']).then()
      })
    } catch (err) {
      this.serverMessage = err as string;
    }


  }

  get emailControl(): FormControl {
    return this.form.controls['email'] as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.controls['password'] as FormControl;
  }

}

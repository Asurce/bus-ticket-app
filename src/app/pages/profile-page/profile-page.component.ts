import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {AuthService} from "../../shared/services/auth.service";
import {firstValueFrom} from "rxjs";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatError,
    MatButton,
    RouterLink
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthService) {
  }

  async ngOnInit() {

    const auth = await firstValueFrom(this.authService.currentUser());
    const user = await firstValueFrom(this.userService.getUserById(auth!.uid));

    this.form = this.formBuilder.group({
      lastName: [user[0]?.name.lastName, Validators.required],
      firstName: [user[0]?.name.firstName, Validators.required],
      email: [user[0]?.email, Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    })
  }

  onSubmit() {
    
  }

  get lastNameControl(): FormControl {
    return this.form.controls['lastName'] as FormControl;
  }

  get firstNameControl(): FormControl {
    return this.form.controls['firstName'] as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.controls['password'] as FormControl;
  }

  get passwordConfirmControl(): FormControl {
    return this.form.controls['passwordConfirm'] as FormControl;
  }


}

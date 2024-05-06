import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {AuthService} from "../../shared/services/auth.service";
import {firstValueFrom} from "rxjs";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    RouterLink,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatLabel,
    MatCardTitle
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {

  currentUser: firebase.default.User | null = null;

  userDataForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private snackService: MatSnackBar) {
  }

  async ngOnInit() {

    this.currentUser = await firstValueFrom(this.authService.currentUser());
    const user = await firstValueFrom(this.userService.getUserById(this.currentUser!.uid))

    this.userDataForm = this.formBuilder.group({
      lastName: [user[0]?.name.lastName, Validators.required],
      firstName: [user[0]?.name.firstName, Validators.required],
      email: [{value: user[0]?.email, disabled: true}, Validators.required]
    })
  }

  userDataSubmit() {
    if (this.userDataForm.valid) {
      this.userService.update({
        email: this.currentUser!.email!,
        name: {firstName: this.firstNameControl.value, lastName: this.lastNameControl.value},
        id: this.currentUser!.uid
      }).then(() => {
        this.snackService.open('Sikeres módosítás.', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000
        })
      })
    }
  }

  get lastNameControl(): FormControl {
    return this.userDataForm.controls['lastName'] as FormControl;
  }

  get firstNameControl(): FormControl {
    return this.userDataForm.controls['firstName'] as FormControl;
  }


}

import {Component, HostBinding, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

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
    MatCardContent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  serverMessage: string = '';

  @HostBinding('style.width')
  isHandset = this.breakpointObserver.isMatched(Breakpoints.Handset) ? '90%' : '30%';

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit() {

  }

  get emailControl(): FormControl {
    return this.form.controls['email'] as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.controls['password'] as FormControl;
  }

}

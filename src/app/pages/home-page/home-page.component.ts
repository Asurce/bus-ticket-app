import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCalendar, MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {map, Observable, startWith} from "rxjs";
import {CommonModule} from "@angular/common";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatHint,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
    MatButton
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class HomePageComponent implements OnInit {

  tempOptions = ['Budapest', 'Gödöllő', 'Kaposvár']

  form!: FormGroup;
  fromFilteredOptions!: Observable<string[]>;
  toFilteredOptions!: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      when: ['', Validators.required],
      timeType: ['departure'],
      discounts: ['none']
    })
    this.fromFilteredOptions = this.fromControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.tempOptions)),
    );
    this.toFilteredOptions = this.toControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.tempOptions)),
    );
  }

  get fromControl(): FormControl {
    return this.form.controls['from'] as FormControl;
  }

  get toControl(): FormControl {
    return this.form.controls['to'] as FormControl;
  }

  private _filter(value: string, collection: string[]): string[] {
    const filterValue = value.toLowerCase();
    return collection.filter(option => option.toLowerCase().includes(filterValue));
  }

}

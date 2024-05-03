import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {map, Observable, startWith, Subject, takeUntil} from "rxjs";
import {CommonModule} from "@angular/common";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButton} from "@angular/material/button";
import {AuthService} from "../../shared/services/auth.service";
import {JourneyService} from "../../shared/services/journey.service";
import {Router} from "@angular/router";
import {City} from "../../shared/models/City";
import {NgxMatTimepickerComponent, NgxMatTimepickerDirective} from "ngx-mat-timepicker";
import {MatIcon} from "@angular/material/icon";
import {Discount} from "../../shared/models/Discount";

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
    MatButton,
    NgxMatTimepickerComponent,
    MatIcon,
    NgxMatTimepickerDirective
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class HomePageComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  fromFilteredOptions!: Observable<City[]>;
  toFilteredOptions!: Observable<City[]>;

  unsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private journeyService: JourneyService,
    private router: Router
  ) {
  }

  ngOnInit() {
    let currentDateTime = new Date();
    let currentTime: string = currentDateTime.getHours() + ":" + currentDateTime.getMinutes();

    this.form = this.formBuilder.group({
      originCity: [null, Validators.required],
      destCity: [null, Validators.required],
      date: [currentDateTime, Validators.required],
      time: [currentTime, Validators.required],
      timeType: [true],
      discounts: [Discount.NONE]
    })

    this.journeyService.getCities().pipe(takeUntil(this.unsubscribe)).subscribe(cities => {
      this.fromFilteredOptions = this.originCityControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterOptions(value || '', cities)),
      );
      this.toFilteredOptions = this.destCityControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterOptions(value || '', cities)),
      );
    })
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  generateJourneys() {
    let dateTime: Date = this.dateControl.value;
    let time: string[] = this.timeControl.value.split(":");
    dateTime.setHours(parseInt(time[0]));
    dateTime.setMinutes(parseInt(time[1]));

    this.journeyService.generateJourneys(
      this.originCityControl.value,
      this.destCityControl.value,
      dateTime,
      this.timeTypeControl.value,
      this.discountsControl.value
    ).then(() => this.router.navigate(['/journey']))
  }

  cityToString(city: City) {
    return city ? city.name : '';
  }

  get originCityControl(): FormControl {
    return this.form.controls['originCity'] as FormControl;
  }

  get destCityControl(): FormControl {
    return this.form.controls['destCity'] as FormControl;
  }

  get dateControl(): FormControl {
    return this.form.controls['date'] as FormControl;
  }

  get timeControl(): FormControl {
    return this.form.controls['time'] as FormControl;
  }

  get timeTypeControl(): FormControl {
    return this.form.controls['timeType'] as FormControl;
  }

  get discountsControl(): FormControl {
    return this.form.controls['discounts'] as FormControl;
  }

  private filterOptions(value: string | City, collection: City[]): City[] {
    const filterValue = (value as City).name ? (value as City).name : (value as string);
    return collection.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  protected readonly Discount = Discount;
}

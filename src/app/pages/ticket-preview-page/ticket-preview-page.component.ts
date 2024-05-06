import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {TicketService} from "../../shared/services/ticket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Ticket} from "../../shared/models/Ticket";
import {CommonModule, DatePipe, NgOptimizedImage} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {DiscountPipe} from "../../shared/pipes/discount.pipe";
import {JourneyService} from "../../shared/services/journey.service";
import {City} from "../../shared/models/City";
import {Journey} from "../../shared/models/Journey";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatLabel} from "@angular/material/form-field";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {Timestamp} from "firebase/firestore";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-ticket-preview-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatDivider,
    MatCardContent,
    NgOptimizedImage,
    DatePipe,
    MatButton,
    DiscountPipe,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCardFooter,
    MatProgressBar
  ],
  templateUrl: './ticket-preview-page.component.html',
  styleUrl: './ticket-preview-page.component.scss'
})
export class TicketPreviewPageComponent implements OnInit {

  id: string = '';
  ticket!: Ticket;
  modifyForm!: FormGroup;
  modifyList: Journey[] = []

  @ViewChild('modifyDialog', {static: true}) modifyDialog!: TemplateRef<any>;

  constructor(private ticketService: TicketService,
              private journeyService: JourneyService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private snackService: MatSnackBar) {
  }

  ngOnInit() {
    const urlID = this.activatedRoute.snapshot.paramMap.get('id')
    if (urlID) {
      this.id = urlID;
    } else {
      this.router.navigateByUrl('/tickets');
    }

    this.modifyForm = new FormGroup({
      time: new FormControl(null, [Validators.required])
    })

    firstValueFrom(this.ticketService.getTicketById(this.id)).then(fireTicket => {
      if (fireTicket) {
        this.ticket = {...fireTicket, ticketID: this.id!};
      } else {
        this.router.navigateByUrl('/tickets');
      }
    })
  }

  async modify() {
    const cities: City[] = await firstValueFrom(this.journeyService.getCities());
    const originCity = cities.find(city => city.name == this.ticket.originCity);
    const destCity = cities.find(city => city.name == this.ticket.destCity);

    if (originCity && destCity) {
      let date: Date;
      const today = new Date();
      const ticketDate = this.ticket.departTime.toDate()

      if (today < ticketDate) {
        if (today.getDay() === ticketDate.getDay()) {
          date = today;
        } else {
          ticketDate.setHours(0)
          ticketDate.setMinutes(0)
          date = ticketDate
        }
      } else {
        if (today.getDay() === ticketDate.getDay()) {
          date = today;
        } else {
          this.errorSnack('A jegyet már nem lehet módosítani.');
          return;
        }
      }

      this.journeyService.generateJourneys(originCity, destCity, date, true, this.ticket.discount);
      this.modifyList = this.journeyService.journeyList!;

      if (this.modifyList!.length == 0) {
        this.errorSnack('A jegyet már nem lehet módosítani.');
      } else {
        const dialogRef = this.dialog.open(this.modifyDialog);
        dialogRef.afterClosed().subscribe(() => {
          if (this.modifyForm.valid) {
            const formJourney: Journey = this.modifyForm.controls['time'].value
            this.ticket.departTime = Timestamp.fromDate(formJourney.departTime);
            this.ticket.arriveTime = Timestamp.fromDate(formJourney.arriveTime);
            this.ticketService.update(this.ticket)
              .then(() => this.router.navigate(['/tickets/' + this.ticket.ticketID]));
          }
        })
      }
    }
  }

  delete() {
    this.ticketService.delete(this.ticket.ticketID).then(() => this.router.navigate(['/tickets']))
  }

  errorSnack(message: string) {
    this.snackService.open(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000
    })
  }
}

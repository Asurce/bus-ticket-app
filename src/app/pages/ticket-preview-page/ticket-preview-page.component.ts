import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {TicketService} from "../../shared/services/ticket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {Ticket} from "../../shared/models/Ticket";
import {DatePipe, NgOptimizedImage} from "@angular/common";
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

@Component({
  selector: 'app-ticket-preview-page',
  standalone: true,
  imports: [
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
    MatDialogClose
  ],
  templateUrl: './ticket-preview-page.component.html',
  styleUrl: './ticket-preview-page.component.scss'
})
export class TicketPreviewPageComponent implements OnInit {

  ticket!: Ticket;
  modifyList: Journey[] = []
  id: string | null = null;

  @ViewChild('modifyDialog', { static: true }) modifyDialog!: TemplateRef<any>;

  modifyForm!: FormGroup;

  constructor(private ticketService: TicketService,
              private journeyService: JourneyService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog
  ) {
  }

  ngOnInit() {

    this.modifyForm = new FormGroup({
      newJourney: new FormControl('', [Validators.required])
    })

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.router.navigate(['/']).then();
    } else {
      firstValueFrom(this.ticketService.getTicketById(this.id)).then(fireTicket => {
        if (fireTicket) {
          this.ticket = {...fireTicket, ticketID: this.id!};
          // TODO fix loading error
        }
      })
    }
  }

  delete() {
    this.ticketService.delete(this.ticket.ticketID).then(() => this.router.navigate(['/tickets']))
  }

  async modify() {
    const cities: City[] = await firstValueFrom(this.journeyService.getCities());
    const originCity = cities.find(city => city.name == this.ticket.originCity);
    const destCity = cities.find(city => city.name == this.ticket.destCity);

    if (originCity && destCity) {
      let date: Date;
      // TODO fix
      if (new Date() > this.ticket.departTime.toDate()) {
        date = this.ticket.departTime.toDate();
        date.setHours(0);
        date.setMinutes(0);
      } else {
        date = this.ticket.departTime.toDate()
      }

      this.journeyService.generateJourneys(originCity, destCity, date, true, this.ticket.discount).then(() => {
        this.modifyList = this.journeyService.journeyList;
        const dialogRef = this.dialog.open(this.modifyDialog);

        dialogRef.afterClosed().subscribe(() => {
          const formJourney: Journey = this.modifyForm.controls['newJourney'].value
          this.ticket.departTime = Timestamp.fromDate(formJourney.departTime);
          this.ticket.arriveTime = Timestamp.fromDate(formJourney.arriveTime);
          this.ticketService.update(this.ticket).then(() => this.router.navigate(['/tickets/' + this.ticket.ticketID]));
        })
      })

    }

  }

}

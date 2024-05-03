import {Component, OnDestroy, OnInit} from '@angular/core';
import {JourneyService} from "../../shared/services/journey.service";
import {Journey} from "../../shared/models/Journey";
import {CommonModule} from "@angular/common";
import {JourneyItemComponent} from "../../shared/components/journey-item/journey-item.component";
import {TicketService} from "../../shared/services/ticket.service";
import {AuthService} from "../../shared/services/auth.service";
import {firstValueFrom} from "rxjs";
import {Router} from "@angular/router";
import {Timestamp} from 'firebase/firestore';
import {FireTicket} from "../../shared/models/Ticket";

@Component({
  selector: 'app-journey-page',
  standalone: true,
  imports: [
    CommonModule,
    JourneyItemComponent
  ],
  templateUrl: './journey-page.component.html',
  styleUrl: './journey-page.component.scss'
})
export class JourneyPageComponent implements OnInit, OnDestroy {

  journeyList: Journey[] | null = null

  constructor(private journeyService: JourneyService,
              private ticketService: TicketService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.journeyList = this.journeyService.journeyList
  }

  ngOnDestroy() {
    this.journeyService.journeyList = null;
  }

  async purchase(journey: Journey) {
    const user = await firstValueFrom(this.authService.currentUser());
    let ticket: FireTicket = {
      originCity: journey.originCity.name,
      destCity: journey.destCity.name,
      departTime: Timestamp.fromDate(journey.departTime),
      arriveTime: Timestamp.fromDate(journey.arriveTime),
      travelTime: journey.travelTime,
      distance: journey.distance,
      price: journey.price,
      discount: journey.discount,
      userID: user?.uid ?? ''
    }

    if (user === null) {
      this.ticketService.pendingTicket = ticket;
      await this.router.navigateByUrl('/login')
    } else {
      this.ticketService.create(ticket).then(doc => {
        this.router.navigateByUrl('/tickets/' + doc.id)
      })
    }


  }

}

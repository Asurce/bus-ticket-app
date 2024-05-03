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

  journeyList: Journey[] = []

  constructor(private journeyService: JourneyService,
              private ticketService: TicketService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.journeyList = this.journeyService.journeyList
  }

  ngOnDestroy() {
    this.journeyService.journeyList = [];
  }

  async purchase(journey: Journey) {
    let user = await firstValueFrom(this.authService.currentUser());

    this.ticketService.create({
      originCity: journey.originCity.name,
      destCity: journey.destCity.name,
      departTime: Timestamp.fromDate(journey.departTime),
      arriveTime: Timestamp.fromDate(journey.arriveTime),
      travelTime: journey.travelTime,
      distance: journey.distance,
      price: journey.price,
      discount: journey.discount,
      userID: user!.uid
    }).then(doc => {
      this.router.navigate(['/tickets/' + doc.id])
    })

  }

}

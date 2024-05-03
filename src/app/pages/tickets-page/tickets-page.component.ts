import {Component, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {Router} from "@angular/router";
import {TicketService} from "../../shared/services/ticket.service";
import {AuthService} from "../../shared/services/auth.service";
import {Ticket} from "../../shared/models/Ticket";
import {CommonModule} from "@angular/common";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow
  ],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.scss'
})
export class TicketsPageComponent implements OnInit {

  tickets: Ticket[] = [];
  displayedColumns = ["originCity", "destCity", "departureTime", "arrivalTime"];

  constructor(private router: Router,
              private ticketService: TicketService,
              private authService: AuthService) {
  }

  ngOnInit() {
    firstValueFrom(this.authService.currentUser()).then(user => {
      this.ticketService.getAllTicketsByUser(user!.uid).subscribe(tickets => {
        this.tickets = [...tickets]
      })
    })
  }

  onClick(id: Ticket) {
    this.router.navigateByUrl("/tickets/" + id.ticketID);
  }
}

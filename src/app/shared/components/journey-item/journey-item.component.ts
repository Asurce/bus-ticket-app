import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Journey} from "../../models/Journey";
import {CommonModule} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {DiscountPipe} from "../../pipes/discount.pipe";
import {Ticket} from "../../models/Ticket";

@Component({
  selector: 'app-journey-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatIcon,
    MatButton,
    MatCardContent,
    DiscountPipe
  ],
  templateUrl: './journey-item.component.html',
  styleUrl: './journey-item.component.scss'
})
export class JourneyItemComponent {

  @Input({required: true}) journey!: Journey | null;
  @Output() purchase: EventEmitter<Journey> = new EventEmitter<Journey>();

}

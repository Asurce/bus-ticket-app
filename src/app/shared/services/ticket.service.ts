import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../models/User";
import {FireTicket, Ticket} from "../models/Ticket";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  ticketsCollection = 'tickets'

  constructor(private firestore: AngularFirestore) { }

  create(ticket: FireTicket) {
    return this.firestore.collection<FireTicket>(this.ticketsCollection).add(ticket);
  }

  getAllTicketsByUser(userID: string) {
    return this.firestore.collection<FireTicket>(this.ticketsCollection, ref => {
      return ref.where('userID', '==', userID)
    }).valueChanges({idField: 'ticketID'});
  }

  getTicketById(id: string) {
    // TODO check user
    return this.firestore.collection<FireTicket>(this.ticketsCollection).doc(id).valueChanges();
  }

  update(ticket: Ticket) {
    const {ticketID, ...fireTicket} = ticket;
    return this.firestore.collection<FireTicket>(this.ticketsCollection).doc(ticketID).set(fireTicket);
  }

  delete(id: string) {
    return this.firestore.collection<FireTicket>(this.ticketsCollection).doc(id).delete();
  }

}

import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {FireTicket, Ticket} from "../models/Ticket";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  ticketsCollection = 'tickets'
  pendingTicket: FireTicket | null = null;

  constructor(private firestore: AngularFirestore) {
  }

  create(ticket: FireTicket) {
    return this.firestore.collection<FireTicket>(this.ticketsCollection).add(ticket);
  }

  getAllTicketsByUser(userID: string) {
    return this.firestore.collection<FireTicket>(this.ticketsCollection, ref => {
      return ref.where('userID', '==', userID)
    }).valueChanges({idField: 'ticketID'});
  }

  getTicketById(id: string) {
    return this.firestore.collection<FireTicket>(this.ticketsCollection).doc(id).valueChanges();
  }

  update(ticket: Ticket) {
    const {ticketID, ...fireTicket} = ticket;
    return this.firestore.collection<FireTicket>(this.ticketsCollection).doc(ticketID).set(fireTicket);
  }

  delete(id: string) {
    return this.firestore.collection<FireTicket>(this.ticketsCollection).doc(id).delete();
  }

  resolvePendingPurchase(userID: string) {
    if (this.pendingTicket) {
      this.pendingTicket.userID = userID;
      return this.create(this.pendingTicket)
    }

    return null;
  }

}

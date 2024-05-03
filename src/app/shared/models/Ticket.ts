import { Timestamp } from 'firebase/firestore';

export interface FireTicket {
  originCity: string,
  destCity: string,
  departTime: Timestamp,
  arriveTime: Timestamp,
  travelTime: number,
  discount: number,
  distance: number,
  price: number
  userID: string
}

export interface Ticket extends FireTicket {
  originCity: string,
  destCity: string,
  departTime: Timestamp,
  arriveTime: Timestamp,
  travelTime: number,
  discount: number,
  distance: number,
  price: number
  userID: string,
  ticketID: string,
}


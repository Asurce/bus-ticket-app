import {City} from "./City";
import {Discount} from "./Discount";

export interface Journey {
  originCity: City,
  destCity: City,
  departTime: Date,
  arriveTime: Date,
  travelTime: number,
  discount: Discount,
  distance: number,
  price: number
}
